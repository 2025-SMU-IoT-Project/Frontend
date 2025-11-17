import React from "react";
import { Button } from "../../components/ui/button.jsx";
import Header from "../../components/Header";
import Map from "../../components/Map";

const userTypes = [{ label: "유저" }, { label: "환경 미화원" }];

export const MainSelectUser = () => {
    return (
        <div
            className="bg-white w-full min-w-[1440px] min-h-[1024px] flex flex-col"
            data-model-id="9:147"
        >
            <Header />

            <main className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-[83px]">
                    <section className="w-[822px] h-[615px] relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                        <div className="w-full h-full flex">
                            <Map />
                        </div>
                    </section>

                    <section className="w-[400px] h-[615px] bg-[#d9d9d9] flex flex-col items-center justify-center gap-[81px] px-[55px] py-[210px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                        <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                            안녕하세요! 당신은
                        </h1>

                        <div className="flex items-center gap-[30px]">
                            {userTypes.map((userType, index) => (
                                <Button
                                    key={index}
                                    className="w-[130px] h-[50px] bg-[linear-gradient(0deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.45)_100%),linear-gradient(0deg,rgba(217,217,217,1)_0%,rgba(217,217,217,1)_100%)] hover:bg-[linear-gradient(0deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.6)_100%),linear-gradient(0deg,rgba(217,217,217,1)_0%,rgba(217,217,217,1)_100%)] [font-family:'Inter',Helvetica] font-bold text-white text-sm text-center tracking-[0.20px] leading-[normal] transition-colors"
                                >
                                    {userType.label}
                                </Button>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};