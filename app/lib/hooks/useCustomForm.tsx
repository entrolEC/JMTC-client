import { useForm, UseFormReturn } from "react-hook-form";
import { infer as zInfer, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

export function useCustomForm<T extends ZodSchema>(formSchema: T, action: any): [UseFormReturn<zInfer<T>>, (data: zInfer<T>) => void] {
    const form = useForm<zInfer<T>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(data: zInfer<T>) {
        try {
            await action({
                data: data,
            });
        } catch (error: any) {
            // If a database error occurs, return a more specific error.
            if (error.code === "P2002") {
                return {
                    message: "중복된 코드가 존재합니다.",
                };
            }
            return {
                message: "데이터베이스 오류.",
            };
        }
        toast({
            title: "제출되었습니다.",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return [form, onSubmit];
}
