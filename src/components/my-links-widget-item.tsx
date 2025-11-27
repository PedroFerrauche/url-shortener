import axios from "axios";
import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { toast } from "sonner";

type MyLinksWidgetItemProps = {
    linkId: string,
    shortUrl: string,
    originalUrl: string,
    clicks: number,
    onSuccess: () => void
}

export function MyLinksWidgetItem({linkId, shortUrl, originalUrl, clicks, onSuccess}: MyLinksWidgetItemProps) {
    const hostInterno = import.meta.env.VITE_FRONTEND_URL;
    const hostApi = import.meta.env.VITE_BACKEND_URL;
    const completeUrl = `${hostInterno}/${shortUrl}`
    
    async function deleteLink(linkId: string, shortUrl:string) {
        const confirmed = window.confirm(`Você realmente quer apagar o link ${shortUrl}?`);

        if (!confirmed) {
            return;
        }

        try {
            axios.delete(`${hostApi}/link/${linkId}`)
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error("Erro ao enviar:", error)
                toast.error("Houve um erro e não foi possível deletar o link.")
            });

        } catch (err) {
            console.error("Erro ao enviar:", err)
        }
    }

    async function copyLinkToClipboard(shortUrl: string) {
        shortUrl = `${hostInterno}/${shortUrl}`
        await navigator.clipboard.writeText(shortUrl)
        toast.success('Texto copiado para a área de transferência!')
    }

    return (
        <div className="grid grid-cols-4 py-2 items-center border-b first:border-t">
            <div className="col-span-2">
                <div className="flex flex-col">
                    <a href={completeUrl} className="text-md text-blue-base truncate" target="_blank" onClick={() => setTimeout(onSuccess, 300)}>{shortUrl}</a>
                    <span className="text-sm text-gray-500 truncate">{originalUrl}</span>
                </div>
            </div>
            <div className="text-sm text-gray-500 text-right">{clicks} {clicks === 1 ? 'acesso' : 'acessos'}</div>
            <div>
                <div className="basis-1/4 flex flex-row gap-1 justify-end">
                    <Button color="secondary" onClick={() => copyLinkToClipboard(shortUrl)}>
                        <CopyIcon />
                    </Button>
                    <Button color="secondary" onClick={() => deleteLink(linkId, shortUrl)}>
                        <TrashIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}