export type ScreenType = 'saved-login' | 'standard-login' | 'signup' | 'forgot-password' | 'dashboard';

export interface SavedAccount {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  followers: number;
  unseenStories: boolean;
}

export type LanguageCode = 'id' | 'en' | 'es' | 'pt';

export interface TranslationDict {
  languageName: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  showText: string;
  hideText: string;
  loginButtonText: string;
  forgotPasswordText: string;
  orText: string;
  facebookLoginText: string;
  signUpPrompt: string;
  signUpLinkText: string;
  getAppPrompt: string;
  bottomText: string;
  continueAs: string;
  switchAccountText: string;
  removeAccountText: string;
  signUpButton: string;
  fullNamePlaceholder: string;
  emailOrPhonePlaceholder: string;
  usernameCustomPlaceholder: string;
  signUpTitle: string;
  signUpSubtitle: string;
  loginPrompt: string;
  loginLinkText: string;
  findAccountHeading: string;
  findAccountSubtitle: string;
  sendLoginLink: string;
  canTReset: string;
  backToLogin: string;
  incorrectPasswordError: string;
  emptyFieldsError: string;
  successTitle: string;
  successMessage: string;
  logoutText: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  id: {
    languageName: 'Bahasa Indonesia',
    usernamePlaceholder: 'Nomor telepon, nama pengguna, atau email',
    passwordPlaceholder: 'Kata sandi',
    showText: 'Tampilkan',
    hideText: 'Sembunyikan',
    loginButtonText: 'Masuk',
    forgotPasswordText: 'Lupa kata sandi?',
    orText: 'ATAU',
    facebookLoginText: 'Masuk dengan Facebook',
    signUpPrompt: 'Tidak punya akun?',
    signUpLinkText: 'Daftar',
    getAppPrompt: 'Dapatkan aplikasi.',
    bottomText: 'dari Meta',
    continueAs: 'Lanjutkan sebagai',
    switchAccountText: 'Ganti akun',
    removeAccountText: 'Hapus akun',
    signUpButton: 'Daftar',
    fullNamePlaceholder: 'Nama Lengkap',
    emailOrPhonePlaceholder: 'Nomor Ponsel atau Email',
    usernameCustomPlaceholder: 'Nama Pengguna',
    signUpTitle: 'Instagram',
    signUpSubtitle: 'Daftar untuk melihat foto dan video dari teman Anda.',
    loginPrompt: 'Punya akun?',
    loginLinkText: 'Masuk',
    findAccountHeading: 'Kesulitan Masuk?',
    findAccountSubtitle: 'Masukkan email atau nama pengguna Anda dan kami akan mengirimkan tautan untuk masuk kembali ke akun Anda.',
    sendLoginLink: 'Kirim Tautan Masuk',
    canTReset: 'Tidak dapat mengatur ulang kata sandi Anda?',
    backToLogin: 'Kembali Ke Halaman Masuk',
    incorrectPasswordError: 'Kata sandi yang Anda masukkan salah. Silakan coba lagi.',
    emptyFieldsError: 'Silakan isi semua bidang.',
    successTitle: 'Berhasil Masuk!',
    successMessage: 'Selamat datang di tiruan Instagram Anda.',
    logoutText: 'Keluar',
  },
  en: {
    languageName: 'English',
    usernamePlaceholder: 'Phone number, username, or email',
    passwordPlaceholder: 'Password',
    showText: 'Show',
    hideText: 'Hide',
    loginButtonText: 'Log In',
    forgotPasswordText: 'Forgot password?',
    orText: 'OR',
    facebookLoginText: 'Log in with Facebook',
    signUpPrompt: "Don't have an account?",
    signUpLinkText: 'Sign up',
    getAppPrompt: 'Get the app.',
    bottomText: 'from Meta',
    continueAs: 'Continue as',
    switchAccountText: 'Switch accounts',
    removeAccountText: 'Remove account',
    signUpButton: 'Sign Up',
    fullNamePlaceholder: 'Full Name',
    emailOrPhonePlaceholder: 'Mobile Number or Email',
    usernameCustomPlaceholder: 'Username',
    signUpTitle: 'Instagram',
    signUpSubtitle: 'Sign up to see photos and videos from your friends.',
    loginPrompt: 'Have an account?',
    loginLinkText: 'Log in',
    findAccountHeading: 'Trouble Logging In?',
    findAccountSubtitle: "Enter your email or username and we'll send you a link to get back into your account.",
    sendLoginLink: 'Send Login Link',
    canTReset: "Can't reset your password?",
    backToLogin: 'Back to Log In',
    incorrectPasswordError: 'The password you entered is incorrect. Please try again.',
    emptyFieldsError: 'Please fill in all fields.',
    successTitle: 'Login Successful!',
    successMessage: 'Welcome back to your Instagram clone.',
    logoutText: 'Log Out',
  },
  es: {
    languageName: 'Español',
    usernamePlaceholder: 'Teléfono, usuario o correo electrónico',
    passwordPlaceholder: 'Contraseña',
    showText: 'Mostrar',
    hideText: 'Ocultar',
    loginButtonText: 'Iniciar sesión',
    forgotPasswordText: '¿Olvidaste tu contraseña?',
    orText: 'O',
    facebookLoginText: 'Iniciar sesión con Facebook',
    signUpPrompt: '¿No tienes una cuenta?',
    signUpLinkText: 'Regístrate',
    getAppPrompt: 'Descarga la aplicación.',
    bottomText: 'de Meta',
    continueAs: 'Continuar como',
    switchAccountText: 'Cambiar de cuenta',
    removeAccountText: 'Eliminar cuenta',
    signUpButton: 'Registrarse',
    fullNamePlaceholder: 'Nombre completo',
    emailOrPhonePlaceholder: 'Número de móvil o correo',
    usernameCustomPlaceholder: 'Nombre de usuario',
    signUpTitle: 'Instagram',
    signUpSubtitle: 'Regístrate para ver fotos y videos de tus amigos.',
    loginPrompt: '¿Tienes una cuenta?',
    loginLinkText: 'Iniciar sesión',
    findAccountHeading: '¿Tienes problemas para entrar?',
    findAccountSubtitle: 'Introduce tu correo o usuario y te enviaremos un enlace para recuperar el acceso a tu cuenta.',
    sendLoginLink: 'Enviar enlace de acceso',
    canTReset: '¿No puedes restablecer tu contraseña?',
    backToLogin: 'Volver a iniciar sesión',
    incorrectPasswordError: 'La contraseña es incorrecta. Compruébala.',
    emptyFieldsError: 'Por favor, rellena todos los campos.',
    successTitle: '¡Inicio de sesión con éxito!',
    successMessage: 'Bienvenido de nuevo a tu clon de Instagram.',
    logoutText: 'Cerrar sesión',
  },
  pt: {
    languageName: 'Português',
    usernamePlaceholder: 'Telefone, nome de usuário ou email',
    passwordPlaceholder: 'Senha',
    showText: 'Mostrar',
    hideText: 'Ocultar',
    loginButtonText: 'Entrar',
    forgotPasswordText: 'Esqueceu a senha?',
    orText: 'OU',
    facebookLoginText: 'Entrar com o Facebook',
    signUpPrompt: 'Não tem uma conta?',
    signUpLinkText: 'Cadastre-se',
    getAppPrompt: 'Obtenha o aplicativo.',
    bottomText: 'da Meta',
    continueAs: 'Continuar como',
    switchAccountText: 'Alternar contas',
    removeAccountText: 'Remover conta',
    signUpButton: 'Cadastre-se',
    fullNamePlaceholder: 'Nome completo',
    emailOrPhonePlaceholder: 'Número do celular ou email',
    usernameCustomPlaceholder: 'Nome de usuário',
    signUpTitle: 'Instagram',
    signUpSubtitle: 'Cadastre-se para ver fotos e vídeos dos seus amigos.',
    loginPrompt: 'Tem uma conta?',
    loginLinkText: 'Conecte-se',
    findAccountHeading: 'Problemas para entrar?',
    findAccountSubtitle: 'Insira o seu email ou nome de usuário e enviaremos um link para você voltar a acessar a sua conta.',
    sendLoginLink: 'Enviar link para login',
    canTReset: 'Não consegue redefinir sua senha?',
    backToLogin: 'Voltar ao login',
    incorrectPasswordError: 'Sua senha está incorreta. Tente novamente.',
    emptyFieldsError: 'Por favor, preencha todos os campos.',
    successTitle: 'Login efetuado com sucesso!',
    successMessage: 'Bem-vindo de volta ao seu clone do Instagram.',
    logoutText: 'Sair',
  },
};

export const INSTAGRAM_LOGO_SVG = `
<svg aria-label="Instagram" class="_aem_ text-black dark:text-white" fill="currentColor" height="51" viewBox="0 0 175 51" width="175" role="img">
  <path d="M14.2 16.5c-.3 0-.6.1-.8.3-.2.2-.3.5-.3.8 0 .3.1.5.3.7.2.2.5.3.8.3s.5-.1.8-.3c.2-.2.3-.5.3-.8 0-.3-.1-.5-.3-.8-.3-.2-.5-.2-.8-.2zm4.3 11c0-1.8.6-3.2 1.8-4.3 1.2-1.1 2.9-1.6 4.9-1.6 2 0 3.7.5 4.9 1.6 1.2 1.1 1.8 2.5 1.8 4.3 0 1.8-.6 3.2-1.8 4.3-1.2 1.1-2.9 1.6-4.9 1.6-2 0-3.7-.5-4.9-1.6-1.2-1.1-1.8-2.5-1.8-4.3zm2.9 0c0 1.1.3 2 1 2.7.7.7 1.6 1 2.8 1s2-.3 2.7-1c.7-.7 1-1.6 1-2.7 0-1.1-.3-2-1-2.7-.7-.7-1.6-1-2.7-1s-2 .3-2.7 1c-.7.7-1 1.6-1 2.7zm20.8-5.3c-.6 0-1.1.1-1.5.4-.4.3-.8.7-1 1.2h-.1V17h-2.8v19.4h2.9v-9.3c0-1.5.4-2.6 1.1-3.3.7-.7 1.6-1 2.8-1 .6 0 1.1.1 1.5.2l.2-2.8c-.4-.1-.7-.2-1.1-.2zm16 5.3c0-1.8.6-3.2 1.8-4.3s2.9-1.6 4.9-1.6c2 0 3.7.5 4.9 1.6 1.2 1.1 1.8 2.5 1.8 4.3 0 1.8-.6 3.2-1.8 4.3s-2.9 1.6-4.9 1.6c-2 0-3.7-.5-4.9-1.6-1.2-1.1-1.8-2.5-1.8-4.3zm2.9 0c0 1.1.3 2 1 2.7.7.7 1.6 1 2.8 1s2-.3 2.7-1c.7-.7 1-1.6 1-2.7 0-1.1-.3-2-1-2.7-.7-.7-1.6-1-2.7-1s-2 .3-2.7 1c-.7.7-1 1.6-1 2.7zm23.2-5.3h-2.8l-1.9 6h-.1l-1.9-6h-2.8l3.1 9.2-1.4 4c-.3.8-.7 1.4-1.2 1.8-.5.4-1.1.6-1.7.6-.3 0-.6 0-.8-.1l-.1 2.4s.5.1.9.1c1.3 0 2.3-.4 3.1-1.3l8.6-16.7zm4.8 5.3c0-1.8.6-3.2 1.8-4.3 1.2-1.1 2.9-1.6 4.9-1.6s3.7.5 4.9 1.6c1.2 1.1 1.8 2.5 1.8 4.3 0 1.8-.6 3.2-1.8 4.3-1.2 1.1-2.9 1.6-4.9 1.6s-3.7-.5-4.9-1.6c-1.2-1.1-1.8-2.5-1.8-4.3zm2.9 0c0 1.1.3 2 1 2.7.7.7 1.6 1 2.8 1s2-.3 2.7-1c.7-.7 1-1.6 1-2.7 0-1.1-.3-2-1-2.7-.7-.7-1.6-1-2.7-1s-2 .3-2.7 1c-.7.7-1 1.6-1 2.7zm24-5.3c-.6 0-1.1.1-1.5.4-.4.3-.8.7-1 1.2h-.1V17H115v19.4h2.9v-9.3c0-1.5.4-2.6 1.1-3.3.7-.7 1.6-1 2.8-1 .6 0 1.1.1 1.5.2l.2-2.8c-.4-.1-.7-.2-1-.2zm16 5.3c0-1.8.6-3.2 1.8-4.3 1.2-1.1 2.9-1.6 4.9-1.6s3.7.5 4.9 1.6c1.2 1.1 1.8 2.5 1.8 4.3 0 1.8-.6 3.2-1.8 4.3-1.2 1.1-2.9 1.6-4.9 1.6s-3.7-.5-4.9-1.6c-1.2-1.1-1.8-2.5-1.8-4.3zm2.9 0c0 1.1.3 2 1 2.7.7.7 1.6 1 2.8 1s2-.3 2.7-1c.7-.7 1-1.6 1-2.7 0-1.1-.3-2-1-2.7-.7-.7-1.6-1-2.7-1s-2 .3-2.7 1c-.7.7-1 1.6-1 2.7zm20.8-5.3c-.6 0-1.1.1-1.5.4-.4.3-.8.7-1 1.2h-.1V17h-2.8v19.4h2.9v-9.3c0-1.5.4-2.6 1.1-3.3.7-.7 1.6-1 2.8-1 .6 0 1.1.1 1.5.2l.2-2.8c-.4-.1-.7-.2-1.1-.2z" />
  <path d="M7 23.3C4.2 23.3 2 21 2 18.2V7.1C2 4.3 4.2 2 7 2h11.1c2.8 0 5 2.2 5 5v11.1c0 2.8-2.2 5.1-5 5.1H7zM18.1 0H7C3.1 0 0 3.1 0 7v11.2c0 3.9 3.1 7 7 7h11.1c3.9 0 7-3.1 7-7V7c0-3.9-3.1-7-7-7zM7.1.9c-.3 0-.6.1-.8.3-.2.2-.3.5-.3.8 0 .3.1.5.3.7.2.2.5.3.8.3s.5-.1.8-.3c.2-.2.3-.5.3-.8 0-.3-.1-.5-.3-.8C7.6 1 7.4.9 7.1.9zm13.1 27.2c-.3 0-.5.1-.8.2-.2.2-.3.4-.3.7 0 .3.1.5.3.7.2.2.5.3.8.3s.5-.1.8-.3c.2-.2.3-.4.3-.7s-.1-.5-.3-.7c-.3-.1-.5-.2-.8-.2zm-12 1.4-1-2c-.9.1-1.8.2-2.8.2-1.3 0-2.5-.2-3.6-.5l-.8 1.8c1.3.4 2.8.6 4.4.6 1.4 0 2.6-.1 3.8-.3zm8-.9c.4.1.8.3 1.2.5L20.1 28c-.5-.3-.9-.6-1.4-.7l-2.5 1.7zm1.1-6c.4-.6.7-1.3 1-2.1l-.8-2c-.2.6-.5 1.1-.8 1.6l.6 2.5zm-5-3.8c-.4.5-.9.9-1.4 1.2l1.6 1.8c.7-.4 1.3-1 1.8-1.7l-2-1.3z" />
</svg>
`;
