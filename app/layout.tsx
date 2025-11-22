export const metadata = {
  title: "Architect AI Assistant for Blender",
  description: "Generate Blender Python scripts to create realistic architectural buildings."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji" }}>
        {children}
      </body>
    </html>
  );
}

