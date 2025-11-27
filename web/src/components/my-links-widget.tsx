import { DownloadSimpleIcon, LinkIcon, SpinnerGapIcon } from "@phosphor-icons/react"
import { Button } from "./ui/button"
import { Title } from "./ui/title"
import { MyLinksWidgetItem } from "./my-links-widget-item"
import axios from "axios"
import { useState } from "react"

interface Link {
  id: string,
  originalUrl: string,
  shortUrl: string,
  clicks: number
}

type ListaRegistrosProps = {
  links: Link[],
  onSuccess: () => void,
  progress: boolean
}

export function MyLinksWidget({ links, onSuccess, progress }: ListaRegistrosProps) {
    const [loading, setLoading] = useState(false)

    const hostApi = import.meta.env.VITE_BACKEND_URL;
    const inProgress = progress
    const linksIsEmpty = links.length == 0

    async function handleDownload() {
        setLoading(true);

        try {
            const response = await axios.get(`${hostApi}/links/exports`);
            const url = response.data.reportUrl;

            const link = document.createElement("a");
            link.href = url;
            link.download = "";
            link.click();
        } catch (error) {
            console.error("Erro ao fazer download", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-100 rounded-lg p-6 h-fit loading-box" data-progress-widget={inProgress}>
            <div className="grid grid-flow-row-dense gap-4">
                <div className="row-span-1 flex flex-row items-center justify-between">
                    <Title title="Meus links" />
                    <Button color="secondary" disabled={linksIsEmpty || loading} onClick={handleDownload}>
                        { loading ? (
                            <SpinnerGapIcon className="mr-1 animate-spin"/>
                        ) : (
                            <DownloadSimpleIcon className="mr-1"/>
                        )}
                        Baixar CSV
                    </Button>
                </div>
                <div className="row-span-1 max-h-[calc(100dvh-300px)] overflow-y-auto scrollbar scrollbar-thumb-blue-base scrollbar-track-transparent">
                    <div>
                        { links.length == 0 ? (
                            <div className="flex flex-col justify-center items-center px-4 py-6 gap-3 border-t">
                                <LinkIcon size={32} className="text-gray-400" />
                                <span className="text-xs text-gray-500 uppercase">ainda não existem links cadastrados</span>
                            </div>
                        ) : (
                            links.map(link => (
                                <MyLinksWidgetItem 
                                    key={link.id}
                                    linkId={link.id}
                                    shortUrl={link.shortUrl}
                                    originalUrl={link.originalUrl}
                                    clicks={link.clicks}
                                    onSuccess={onSuccess}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>       
    )
}