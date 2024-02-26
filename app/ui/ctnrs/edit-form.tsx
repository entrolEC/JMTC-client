"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ctnr } from ".prisma/client";
import { updateCtnr } from "@/app/lib/ctnrs/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function CtnrEditForm({ ctnr }: { ctnr: Ctnr }) {
    const initialState = { message: null, errors: {} };
    const updateCtnrWithId = updateCtnr.bind(null, ctnr.id);
    const [state, dispatch] = useFormState(updateCtnrWithId, initialState);
    return (
        <form action={dispatch}>
            <div className="mb-4">
                <label htmlFor="code" className="mb-2 block text-sm font-medium">
                    코드
                </label>
                <div className="relative mt-2 rounded-md">
                    <Input id="code" name="code" placeholder="코드를 입력해주세요." defaultValue={ctnr.code} aria-describedby="code-error" />
                </div>

                <div id="code-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.code &&
                        state.errors.code.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    이름
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <Input id="name" name="name" defaultValue={ctnr.name} placeholder="이름을 입력하세요." aria-describedby="name-error" />
                    </div>
                </div>

                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name &&
                        state.errors.name.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="container_mode" name="container_mode" defaultChecked={ctnr.containerMode} />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex text-sm items-center space-x-1 font-medium" disabled>
                                <p>컨테이너 모드</p>
                                <InformationCircleIcon className="w-6" />
                                <TooltipContent>
                                    <p>
                                        컨테이너 모드를 활성화하면, 견적서에 추가 시 견적서 항목의 UnitType이 자동으로 컨테이너 단위와 동일하게
                                        설정됩니다.
                                    </p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div id="container-mode-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.containerMode &&
                        state.errors.containerMode.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                    설명
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <Input
                            id="name"
                            name="description"
                            defaultValue={ctnr.description ?? ""}
                            placeholder="설명을 입력하세요."
                            aria-describedby="name-error"
                        />
                    </div>
                </div>

                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.descrtion &&
                        state.errors.descrtion.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <p className="mt-2 text-sm font-bold text-red-500">{state.message}</p>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">Ctnr 수정</Button>
            </div>
        </form>
    );
}
