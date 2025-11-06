import React from "react";
import { Button } from "../../components/ui/button.jsx";

const navigationLinks = [
    { label: "Map", active: true },
    { label: "Dashboard", active: false },
];

const userTypes = [{ label: "유저" }, { label: "환경 미화원" }];

const mapPins = [
    { top: "top-[189px]", left: "left-[342px]" },
    { top: "top-[287px]", left: "left-[310px]" },
    { top: "top-[209px]", left: "left-[412px]" },
];

export const MainSelectUser = () => {
    return (
        <div
            className="bg-white w-full min-w-[1440px] min-h-[1024px] flex flex-col"
            data-model-id="9:147"
        >
            <header className="flex items-center justify-between px-[114px] pt-[21px] pb-4">
                <div className="inline-flex items-end gap-2.5 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
                    <div className="w-7 h-7 bg-[url(https://c.animaapp.com/mhmu6djuEhBhwI/img/icon.png)] bg-cover bg-[50%_50%]" />
                    <div className="inline-flex items-center justify-center gap-2.5">
                        <div className="flex items-center justify-center w-[92px] h-[25px] mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-black text-sm tracking-[0.20px] leading-[normal]">
                            IoT 8조
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-[140px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
                    {navigationLinks.map((link, index) => (
                        <button
                            key={index}
                            className={`w-20 h-[18px] flex items-center justify-center [font-family:'Inter',Helvetica] text-sm text-center tracking-[0.20px] leading-[normal] transition-colors ${link.active
                                    ? "font-bold text-[#34c759]"
                                    : "font-medium text-systemgrey-800 hover:text-[#34c759]"
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-[83px]">
                    <section className="w-[822px] h-[615px] relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                        <div className="w-full h-full flex">
                            <img
                                className="w-full h-full object-cover"
                                alt="Map API"
                                src="https://c.animaapp.com/mhmu6djuEhBhwI/img/map-api.png"
                            />
                        </div>

                        {mapPins.map((pin, index) => (
                            <div
                                key={index}
                                className={`absolute w-[41px] h-[41px] bg-[url(https://c.animaapp.com/mhmu6djuEhBhwI/img/ping-3.png)] bg-cover bg-[50%_50%] ${pin.top} ${pin.left}`}
                            />
                        ))}
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