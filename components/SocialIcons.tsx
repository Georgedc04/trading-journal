"use client";
import Link from "next/link";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaDiscord,
} from "react-icons/fa";

export default function SocialIcons({ ACTIVE }: any) {
  const ICON_CLASS = `
    w-6 h-6 
    ${ACTIVE.socialBase} 
    hover:scale-125 hover:-translate-y-1
    transition-all duration-300 ease-out 
    ${ACTIVE.socialHover}
  `;

  return (
    <div className="flex items-center justify-center gap-7 py-6 relative z-10">
      <Link href="https://discord.gg/YJnTSH8S" target="_blank">
        <FaDiscord className={`${ICON_CLASS} text-[#5865F2]`} />
      </Link>

      <Link href="https://github.com/" target="_blank">
        <FaGithub className={ICON_CLASS} />
      </Link>

      <Link href="https://x.com/" target="_blank">
        <FaTwitter className={`${ICON_CLASS} text-[#1DA1F2]`} />
      </Link>

      <Link href="https://instagram.com/" target="_blank">
        <FaInstagram className={`${ICON_CLASS} text-[#E4405F]`} />
      </Link>

      <Link href="https://linkedin.com/" target="_blank">
        <FaLinkedin className={`${ICON_CLASS} text-[#0A66C2]`} />
      </Link>
    </div>
  );
}
