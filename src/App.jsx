// App.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import { useState, useEffect } from "react";

import api from "./services/api";

import {
  MapPin,
  Clock3,
  LogIn,
  LogOut,
  FileText,
  User,
  Home,
  Users,
  ArrowLeft
} from "lucide-react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

// ================= LOGIN =================

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin() {

    try {

      const response = await api.post("/Auth/login", {
        email,
        senha
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", response.data.usuario);
      localStorage.setItem("tipo", response.data.tipo);

      alert("Login realizado com sucesso!");

      navigate("/home");

    } catch (error) {

      console.log(error);

      alert("Email ou senha inválidos");

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10">

        <div className="flex flex-col items-center">

          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            ✓
          </div>

          <h1 className="text-5xl font-bold text-blue-900 mt-4">
            PontoCerto
          </h1>

          <h2 className="text-2xl font-semibold mt-8">
            Bem-vindo de volta!
          </h2>

          <p className="text-gray-500 mb-8">
            Faça login para continuar
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Digite seu email"
            className="w-full border rounded-xl p-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full border rounded-xl p-4 outline-none"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            onClick={fazerLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-4 rounded-xl text-lg font-semibold"
          >
            Entrar
          </button>

        </div>

      </div>

    </div>
  );
}

// ================= HOME =================

function HomePage() {

  const usuario = localStorage.getItem("usuario");
  const tipo = localStorage.getItem("tipo");

  console.log("TIPO:", tipo);

  async function registrarPonto(tipo) {

    try {

      const token = localStorage.getItem("token");

      navigator.geolocation.getCurrentPosition(async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const dados = {
          usuarioId: 1002,
          tipoRegistro: tipo,
          latitude,
          longitude,
          observacao: tipo
        };

        await api.post("/Ponto", dados, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert(`${tipo} registrada com sucesso!`);

      });

    } catch (error) {

      console.log(error);

      alert("Erro ao registrar ponto");

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">

      <div className="w-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-xl">

        {/* HEADER */}

        <div className="bg-blue-700 text-white p-8">

          <div className="flex justify-between items-start">

            <div>
              <p className="text-lg">
                Bem-vinda,
              </p>

              <h1 className="text-5xl font-bold mt-2">
                {usuario} 👋
              </h1>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              <LogOut size={30} />
            </button>

          </div>

          <div className="bg-white text-black rounded-2xl mt-8 p-5 flex justify-between items-center">

            <div>

              <div className="flex items-center gap-2">

                <div className="w-3 h-3 bg-green-500 rounded-full"></div>

                <span className="font-semibold">
                  Localização ativa
                </span>

              </div>

              <p className="text-gray-500 mt-2">
                Você está dentro da área permitida
              </p>

            </div>

            <MapPin className="text-blue-700" />

          </div>

        </div>

        {/* BOTÕES */}

        <div className="p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <button
              onClick={() => registrarPonto("Entrada")}
              className="bg-green-500 hover:bg-green-600 transition text-white rounded-3xl p-8"
            >

              <div className="bg-white w-24 h-24 rounded-full flex justify-center items-center mx-auto mb-6">

                <Clock3
                  className="text-green-500"
                  size={40}
                />

              </div>

              <h2 className="text-3xl font-bold">
                Registrar Entrada
              </h2>

              <p className="mt-5 text-lg">
                Iniciar jornada →
              </p>

            </button>

            <button
              onClick={() => registrarPonto("Saida")}
              className="bg-red-500 hover:bg-red-600 transition text-white rounded-3xl p-8"
            >

              <div className="bg-white w-24 h-24 rounded-full flex justify-center items-center mx-auto mb-6">

                <LogOut
                  className="text-red-500"
                  size={40}
                />

              </div>

              <h2 className="text-3xl font-bold">
                Registrar Saída
              </h2>

              <p className="mt-5 text-lg">
                Finalizar jornada →
              </p>

            </button>

          </div>

          {/* HISTÓRICO */}

          <Link to="/historico">

            <div className="bg-white border rounded-2xl p-5 flex justify-between items-center mt-8 shadow-sm hover:shadow-md transition">

              <div className="flex gap-4 items-center">

                <div className="bg-blue-600 p-4 rounded-full text-white">
                  <FileText />
                </div>

                <div>

                  <h3 className="font-bold text-xl">
                    Ver Histórico
                  </h3>

                  <p className="text-gray-500">
                    Consulte seus registros
                  </p>

                </div>

              </div>

              <span className="text-3xl">
                ›
              </span>

            </div>

          </Link>

        </div>

        <BottomMenu active="home" />

      </div>

    </div>
  );
}

// ================= HISTÓRICO =================

function Historico() {

  const [registros, setRegistros] = useState([]);

  // FILTRO
  const [filtroData, setFiltroData] = useState("");

  useEffect(() => {

    buscarRegistros();

  }, []);

  async function buscarRegistros() {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/Ponto", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRegistros(response.data);

    } catch (error) {

      console.log(error);

      alert("Erro ao buscar histórico");

    }
  }

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">

      <div className="w-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-xl">

        {/* HEADER */}

        <div className="bg-blue-700 text-white p-6 relative">

          <Link
            to="/home"
            className="absolute left-6 top-1/2 -translate-y-1/2"
          >
            <ArrowLeft />
          </Link>

          <h1 className="text-4xl font-bold text-center">
            Histórico
          </h1>

        </div>

        {/* FILTRO */}

        <div className="p-6 pb-0">

          <div className="flex flex-col md:flex-row gap-4 items-center">

            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="border rounded-xl p-3 w-full md:w-72"
            />

            <button
              onClick={() => setFiltroData("")}
              className="bg-gray-200 hover:bg-gray-300 transition px-4 py-3 rounded-xl"
            >
              Limpar filtro
            </button>

          </div>

        </div>

        {/* LISTA */}

        <div className="p-6 space-y-5">

          {registros

            .filter((item) => {

              if (!filtroData) return true;

              const dataRegistro =
                new Date(item.horario)
                  .toISOString()
                  .split("T")[0];

              return dataRegistro === filtroData;

            })

            .map((item) => (

              <div
                key={item.id}
                className="border rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 hover:shadow-md transition"
              >

                {/* ESQUERDA */}

                <div className="flex gap-4">

                  <div
                    className={`${
                      item.tipoRegistro === "Entrada"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white p-4 rounded-full h-fit`}
                  >

                    {item.tipoRegistro === "Entrada"
                      ? <LogIn />
                      : <LogOut />
                    }

                  </div>

                  <div>

                    {/* USUÁRIO */}

                    {item.usuario && (

                      <p className="font-bold text-blue-700 mb-1">
                        {item.usuario}
                      </p>

                    )}

                    {/* DATA */}

                    <p className="font-semibold text-lg">

                      {new Date(item.horario)
                        .toLocaleDateString("pt-BR")}

                    </p>

                    {/* TIPO */}

                    <p className="text-gray-500">
                      {item.tipoRegistro}
                    </p>

                    {/* LATITUDE */}

                    <div className="text-sm text-gray-400 mt-2">
                      Latitude: {item.latitude}
                    </div>

                    {/* LONGITUDE */}

                    <div className="text-sm text-gray-400">
                      Longitude: {item.longitude}
                    </div>

                    {/* GOOGLE MAPS */}

                    <a
                      href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-sm mt-2 block hover:underline"
                    >
                      Abrir no Google Maps
                    </a>

                  </div>

                </div>

                {/* DIREITA */}

                <div className="text-right">

                  {/* HORA */}

                  <h2 className="text-3xl font-bold">

                    {new Date(item.horario)
                      .toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}

                  </h2>

                  {/* STATUS */}

                  <div
                    className={`mt-3 px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                      item.tipoRegistro === "Entrada"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {item.tipoRegistro}

                  </div>

                </div>

              </div>

            ))}

        </div>

        <BottomMenu active="historico" />

      </div>

    </div>

  );
}

// ================= PERFIL =================

function Perfil() {

  const [nome, setNome] = useState(localStorage.getItem("usuario"));
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const tipo = localStorage.getItem("tipo");

  async function salvarAlteracoes() {

    alert("Tela pronta para integrar com API");

  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-blue-700 text-white p-8">

          <h1 className="text-4xl font-bold">
            Meu Perfil
          </h1>

          <p className="text-blue-100 mt-2">
            Atualize seus dados
          </p>

        </div>

        <div className="p-8 space-y-5">

          <div>

            <label className="font-semibold">
              Nome
            </label>

            <input
              type="text"
              className="w-full border rounded-xl p-4 mt-2"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

          </div>

          <div>

            <label className="font-semibold">
              Tipo de usuário
            </label>

            <input
              type="text"
              value={tipo}
              disabled
              className="w-full border rounded-xl p-4 mt-2 bg-gray-100"
            />

          </div>

          <div>

            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              className="w-full border rounded-xl p-4 mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div>

            <label className="font-semibold">
              Nova Senha
            </label>

            <input
              type="password"
              className="w-full border rounded-xl p-4 mt-2"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

          </div>

          <button
            onClick={salvarAlteracoes}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-4 rounded-xl font-semibold"
          >
            Salvar Alterações
          </button>

        </div>

        <BottomMenu active="perfil" />

      </div>

    </div>
  );
}

// ================= USUÁRIOS =================

function Usuarios() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("USER");

  async function cadastrarUsuario() {

    try {

      const token = localStorage.getItem("token");

      const dados = {
        nome,
        email,
        senha,
        tipoUsuario
      };

      await api.post("/Usuario", dados, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Usuário cadastrado com sucesso!");

      setNome("");
      setEmail("");
      setSenha("");
      setTipoUsuario("USER");

    } catch (error) {

      console.log(error);

      alert("Erro ao cadastrar usuário");

    }
  }

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-blue-700 text-white p-6 relative">

          <Link
            to="/home"
            className="absolute left-6 top-1/2 -translate-y-1/2"
          >
            <ArrowLeft />
          </Link>

          <h1 className="text-4xl font-bold text-center">
            Usuários
          </h1>

        </div>

        {/* FORM */}

        <div className="p-8 space-y-5">

          <div>

            <label className="font-semibold">
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
              placeholder="Digite o nome"
            />

          </div>

          <div>

            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
              placeholder="Digite o email"
            />

          </div>

          <div>

            <label className="font-semibold">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
              placeholder="Digite a senha"
            />

          </div>

          <div>

            <label className="font-semibold">
              Tipo de Usuário
            </label>

            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
            >

              <option value="USER">
                USER
              </option>

              <option value="ADM">
                ADM
              </option>

            </select>

          </div>

          <button
            onClick={cadastrarUsuario}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-4 rounded-xl font-semibold"
          >
            Cadastrar Usuário
          </button>

        </div>

        <BottomMenu active="usuarios" />

      </div>

    </div>

  );
}

// ================= MENU =================

function BottomMenu({ active }) {

  const tipo = localStorage.getItem("tipo");

  return (

    <div className="border-t flex justify-around p-5 bg-white">

      <Link
        to="/home"
        className={`flex flex-col items-center ${
          active === "home"
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >

        <Home />

        <span>
          Início
        </span>

      </Link>

      <Link
        to="/historico"
        className={`flex flex-col items-center ${
          active === "historico"
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >

        <FileText />

        <span>
          Histórico
        </span>

      </Link>

      {/* APENAS ADM */}

      {tipo?.toUpperCase() === "ADMIN" && (

        <Link
          to="/usuarios"
          className={`flex flex-col items-center ${
            active === "usuarios"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >

          <Users />

          <span>
            Usuários
          </span>

        </Link>

      )}

      <Link
        to="/perfil"
        className={`flex flex-col items-center ${
          active === "perfil"
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >

        <User />

        <span>
          Perfil
        </span>

      </Link>

    </div>

  );
}