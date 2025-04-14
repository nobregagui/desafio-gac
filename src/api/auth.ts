import { API_BASE_URL } from "./config";
import { toast } from 'react-toastify';

export const loginUser = async (email: string, senha: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?email=${email}&password=${senha}`);
    const data = await response.json();

    if (data.length > 0) {
      return { success: true, user: data[0] };
    } else {
      return { success: false, message: "Email ou senha incorretos." };
    }
  } catch (error) {
    return { success: false, message: "Erro ao conectar com o servidor." };
  }
};

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const { name, email, password } = data;

  try {
    // Fazendo uma requisição POST para o JSON Server para criar um novo usuário
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST', // Definindo o método POST
      headers: {
        'Content-Type': 'application/json', // Definindo o tipo de conteúdo como JSON
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }), // Passando o corpo da requisição com as informações do usuário
    });

    if (!response.ok) {
      throw new Error('Erro ao cadastrar usuário');
    }

    const user = await response.json();
    toast.success('Usuário cadastrado com sucesso!');
    return user;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    toast.error('Erro ao registrar usuário');
    throw error;
  }
};
