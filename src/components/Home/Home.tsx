import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deposit,
  transfer,
  revertLastOperation,
} from "../../api/financeService";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [depositAmount, setDepositAmount] = useState<number | string>("");
  const [transferAmount, setTransferAmount] = useState<number | string>("");
  const [user, setUser] = useState<{
    id: number;
    name?: string;
    email: string;
    saldo?: number;
  } | null>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const navigate = useNavigate();

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor, insira um valor válido para o depósito.");
      return;
    }

    if (user) {
      try {
        const newBalance = await deposit(user.id, amount);
        setBalance(newBalance);
        toast.success(`Depósito de R$${amount} realizado com sucesso!`);
        setDepositAmount("");
      } catch {
        toast.error("Erro ao realizar depósito.");
      }
    }
  };

  const handleTransfer = async () => {
    const amount = Number(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor, insira um valor válido para a transferência.");
      return;
    }

    if (user) {
      try {
        const res = await transfer(user.id, targetEmail, amount);
        setBalance(res.newBalance);
        toast.success(`Transferência de R$${amount} para ${targetEmail} realizada com sucesso!`);
        setTransferAmount("");
        setTargetEmail("");
      } catch (error: any) {
        toast.error(error.message || "Erro ao realizar transferência.");
      }
    }
  };

  const handleReverseLastOperation = async () => {
    if (user) {
      try {
        const newBalance = await revertLastOperation(user.id);
        setBalance(newBalance);
        toast.success("Operação revertida com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Erro ao reverter operação.");
      }
    }
  };

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      const userParsed = JSON.parse(userStorage);
      setUser(userParsed);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.saldo) {
        setBalance(user.saldo);
      } else {
        toast.error("Erro ao carregar o saldo.");
      }
    }
  }, [user]);

  return (
    <div>
      <header className={styles.header}>
        <div>
          {user?.name ? (
            <span className={styles.welcome}>Bem-vindo, {user.name}!</span>
          ) : (
            <span className={styles.welcome}>Bem-vindo!</span>
          )}
        </div>
        <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Sair
        </button>
      </header>
      <div className={styles.container}>
        <h1 className={styles.title}>💰 Operações Financeiras</h1>
        <div className={styles.balanceCard}>
          <span className={styles.balanceLabel}>Saldo Atual</span>
          <span className={styles.balance}>R$ {balance?.toFixed(2)}</span>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Depósito</h2>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Digite o valor para depósito"
            className={styles.input}
          />
          <button className={styles.button} onClick={handleDeposit}>
            Depositar
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Transferência</h2>
          <input
            type="text"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            placeholder="Usuário destino (email)"
            className={styles.input}
          />
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Digite o valor para transferência"
            className={styles.input}
          />
          <button className={styles.button} onClick={handleTransfer}>
            Transferir
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reversão</h2>
          <button className={styles.buttonSecondary} onClick={handleReverseLastOperation}>
            Reverter Última Operação
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
