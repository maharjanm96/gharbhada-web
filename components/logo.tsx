import Image from "next/image";

const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/gharbhada.svg"
        alt="GharBhada Logo"
        width={200}
        height={200}
        priority
      />
    </div>
  );
};

export { LogoIcon };
