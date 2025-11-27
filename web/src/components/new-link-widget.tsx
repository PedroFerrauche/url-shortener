import { Button } from "./ui/button";
import { TextField } from "./ui/text-field";
import { Title } from "./ui/title";
import axios from "axios";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";

const createLinkInput = z.object({
    originalUrl: z.string().url("Informe uma url válida."),
    shortUrl: z.string().regex(/^[a-z0-9-_]{3,30}$/, {
        message: 'Informe uma url minúscula e sem espaço/caracter especial.',
    }),
})

type CreateLinkInput = z.infer<typeof createLinkInput>

type FormProps = {
  onSuccess: () => void;
};

export function NewLinkWidget({ onSuccess }: FormProps) {
    const hostApi = import.meta.env.VITE_BACKEND_URL;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateLinkInput>({
        resolver: zodResolver(createLinkInput),
    });

    async function onSubmit(data: CreateLinkInput) {

        try {
            await axios.post(`${hostApi}/link`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            toast.success("Dados enviados com sucesso!");
            reset();
            onSuccess();

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Erro da API:", error.response?.data);
                toast.error(error.response?.data?.message || "Erro ao enviar dados");
            } else {
                console.error("Erro inesperado:", error);
                toast.error("Ocorreu um erro inesperado");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-100 rounded-lg w-full p-6">
                <div className="grid grid-flow-row-dense gap-4">
                    <div className="row-span-1">
                        <Title title="Novo link" />
                    </div>
                    <div className="row-span-1">
                        <TextField 
                            registration={register("originalUrl")}
                            label="Link original" 
                            placeholder="www.exemplo.com.br" 
                            disabled={isSubmitting}
                            // onChange={(e) => setOriginalUrl(e.target.value)}
                            error={errors.originalUrl?.message}
                        />
                    </div>
                    <div className="row-span-1">
                        <TextField 
                            registration={register("shortUrl")}
                            label="Link encurtado" 
                            prefix="brev.ly/"
                            disabled={isSubmitting}
                            // onChange={(e) => setShortUrl(e.target.value)}
                            error={errors.shortUrl?.message}
                        />
                    </div>
                    <div className="row-span-1">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar link'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}