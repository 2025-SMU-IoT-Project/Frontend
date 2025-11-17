import React from "react";
import Header from "../../components/Header";
import Map from "../../components/Map";

export const MainMap = () => {

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

                    <section className="w-[400px] h-[615px] bg-[#fff4b0]/25 flex flex-col items-center justify-center gap-[81px] px-[55px] py-[210px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                        <h1 className="[font-family:'Inter',Helvetica] font-bold text-black text-sm text-center tracking-[0.20px] leading-[normal]">
                            지도에서 쓰레기통을 선택해주세요.
                        </h1>
                    </section>
                </div>
            </main>
        </div>
    );
};