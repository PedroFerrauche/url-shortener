import LogoIcon from '../assets/images/logo_icon.svg';
import Error404 from '../assets/images/404.svg';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type LinkData = {
  id: string,
  originalUrl: string
};

export default function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const host = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchLink() {
      try {
        const response = await axios.get<LinkData>(`${host}/link/original-url?shortUrl=${shortUrl}`);
        setLink(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (shortUrl) fetchLink();  
  }, [shortUrl]);

  useEffect(() => {
    async function countRedirect() {
        try {
            await axios.put(`${host}/link/click/${link?.id}`);
        } catch (err) {
            console.error("Não foi possível contabilizar o redirect", err);
        } finally {
            if (link?.originalUrl) {
                window.location.href = link.originalUrl;
            }
        }
    }

    if (link?.originalUrl) {
        countRedirect()
    }
  }, [link]);

  if (loading) {
    return (
      <main className="h-dvh flex items-center justify-center p-2">
        <div className="max-w-[366px] sm:max-w-[580px] py-12 px-5 sm:py-16 sm:px-11 gap-6 bg-gray-100 rounded-lg flex flex-col justify-center items-center">
          <img src={LogoIcon} alt="Ícone do Logo" />
          <span className="text-gray-600 text-xl text-center">Redirecionando...</span>
          <div className='flex flex-col text-center'>
            <span className="text-gray-500 text-md mb-1">O link será aberto automaticamente em alguns instantes.</span>
            <span className="text-gray-500 text-md">Não foi redirecionado? Acesse aqui</span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !link) {
    return (
      <main className="h-dvh flex items-center justify-center p-3">
        <div className="max-w-[366px] sm:max-w-[580px] py-12 px-5 sm:py-16 sm:px-11 bg-gray-100 rounded-lg flex flex-col justify-center items-center gap-6">
          <img src={Error404} alt="Ícone do Logo" className="w-[194px]" />
          <span className="text-gray-600 text-xl text-center">Link não encontrado</span>
          <div className='flex flex-col text-center'>
            <span className="text-gray-500 text-md">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em brev.ly.</span>
          </div>
        </div>
      </main>
    );
  }

  return null;
}