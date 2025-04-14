import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { ToastContainer } from 'react-toastify';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {}
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Crie sua conta</h2>

        <label>Nome</label>
        <input
          {...register('name', { required: 'O nome é obrigatório' })}
          placeholder="Seu nome completo"
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}

        <label>E-mail</label>
        <input
          type="email"
          {...register('email', {
            required: 'O e-mail é obrigatório',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'E-mail inválido',
            },
          })}
          placeholder="voce@email.com"
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}

        <label>Senha</label>
        <input
          type="password"
          {...register('password', {
            required: 'A senha é obrigatória',
            minLength: {
              value: 6,
              message: 'A senha deve ter no mínimo 6 caracteres',
            },
          })}
          placeholder="Crie uma senha"
        />
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}

        <label>Confirmar Senha</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Confirme sua senha',
            validate: (value) =>
              value === watch('password') || 'As senhas não coincidem',
          })}
          placeholder="Repita a senha"
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}

        <button type="submit">Cadastrar</button>

        <div className={styles.loginLink}>
          Já tem uma conta? <Link to="/">Entrar</Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
