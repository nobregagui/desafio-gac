// services/financeService.ts
import { API_BASE_URL } from "./config";

// Deposit a specific amount to a user's balance
export const deposit = async (userId: number, amount: number) => {
  const userRes = await fetch(`${API_BASE_URL}/users/${userId}`);
  const user = await userRes.json();

  const currentBalance = user.saldo || 0;
  const newBalance = currentBalance + amount;

  await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saldo: newBalance })
  });

  await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      type: "deposit",
      amount,
      toUserId: null,
      timestamp: new Date().toISOString()
    })
  });

  return newBalance;
};

// Transfer funds from one user to another
export const transfer = async (fromUserId: number, toUserEmail: string, amount: number) => {
  const senderRes = await fetch(`${API_BASE_URL}/users/${fromUserId}`);
  const sender = await senderRes.json();

  const recipientRes = await fetch(`${API_BASE_URL}/users?email=${toUserEmail}`);
  const recipientList = await recipientRes.json();
  const recipient = recipientList[0];

  if (!recipient) throw new Error("Destination user not found.");
  if (sender.saldo < amount) throw new Error("Insufficient balance.");

  await fetch(`${API_BASE_URL}/users/${fromUserId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saldo: sender.saldo - amount })
  });

  await fetch(`${API_BASE_URL}/users/${recipient.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saldo: (recipient.saldo || 0) + amount })
  });

  await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: fromUserId,
      type: "transfer",
      amount,
      toUserId: recipient.id,
      timestamp: new Date().toISOString()
    })
  });

  return { newBalance: sender.saldo - amount };
};

// Revert the user's last financial operation
export const revertLastOperation = async (userId: number) => {
  const res = await fetch(`${API_BASE_URL}/transactions?userId=${userId}&_sort=timestamp&_order=desc`);
  const history = await res.json();
  const last = history[0];
  if (!last) throw new Error("No operations found.");

  const userRes = await fetch(`${API_BASE_URL}/users/${userId}`);
  const user = await userRes.json();
  let newBalance = user.saldo;

  if (last.type === "deposit") {
    newBalance -= last.amount;
  } else if (last.type === "transfer") {
    const toUserRes = await fetch(`${API_BASE_URL}/users/${last.toUserId}`);
    const toUser = await toUserRes.json();

    await fetch(`${API_BASE_URL}/users/${last.toUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saldo: toUser.saldo - last.amount })
    });

    newBalance += last.amount;
  }

  await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saldo: newBalance })
  });

  await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      type: "reversal",
      amount: last.amount,
      toUserId: last.toUserId || null,
      timestamp: new Date().toISOString()
    })
  });

  return newBalance;
};
