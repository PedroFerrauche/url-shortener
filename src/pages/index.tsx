import Logo from '../assets/images/logo.svg';
import { NewLinkWidget } from "../components/new-link-widget";
import { MyLinksWidget } from "../components/my-links-widget";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";

interface Link {
  id: string,
  originalUrl: string,
  shortUrl: string,
  clicks: number
}

export default function Index() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarLinks() {
    setLoading(true);
    try {
      const host = import.meta.env.VITE_BACKEND_URL;

      await axios.get(`${host}/links`)
        .then((response) => {
            setLinks(response.data.links);
        })
        .catch(error => {
          console.error("Erro ao carregar links:", error);
          toast.error("Não foi possível carregar a lista de links!");
        });

    } catch (err) {
      console.error("Erro ao carregar links:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarLinks();
  }, []);

  return (
    <main className="h-dvh max-w-5xl mx-auto px-6">
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 gap-5">
        <img src={Logo} alt="Logo" className="w-[96px] mx-auto col-span-full mt-8 sm:mx-0 sm:mt-20" />
        <NewLinkWidget onSuccess={carregarLinks} />
        <MyLinksWidget onSuccess={carregarLinks} progress={loading} links={links} />
      </div>
      <Toaster richColors position="bottom-right" />
    </main>
  )
}