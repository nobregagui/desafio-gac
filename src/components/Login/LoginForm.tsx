import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import React from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/auth";
import { ToastContainer } from "react-toastify";

type FormData = {
  email: string;
  senha: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const response = await loginUser(data.email, data.senha);

    if (response.success) {
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/home");
    } else {
      setError("senha", { message: "Email ou senha inválidos" });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Entrar na sua conta</h2>

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="seuemail@exemplo.com"
          {...register("email", { required: "Email é obrigatório" })}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          placeholder="********"
          {...register("senha", { required: "Senha é obrigatória" })}
        />
        {errors.senha && <span className={styles.error}>{errors.senha.message}</span>}

        <button type="submit">Entrar</button>

        <div className={styles.links}>
          <a href="#">Esqueci minha senha</a>
          <span>•</span>
        </div>

        <div className={styles.registerLink}>
          Ainda não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
