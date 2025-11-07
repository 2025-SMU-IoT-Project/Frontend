const navigationLinks = [
    { label: "Map", active: true },
    { label: "Dashboard", active: false },
];

const Header = () => {
    return (
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
    )
}

export default Header;