export default function InputField({ icon, colors, ...props }: any) {
  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 border transition focus-within:ring-2 focus-within:ring-emerald-500"
      style={{ borderColor: colors.border }}
    >
      {icon}
      <input
        {...props}
        className="w-full bg-transparent outline-none p-2 text-sm"
        style={{ color: colors.text }}
      />
    </div>
  )
}
