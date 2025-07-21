"use state";
import React from "react";

const Section = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  return (
    <section className=" mb-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-lg">{content}</p>
    </section>
  );
};

export default function page() {
  return (
    <div className="flex justify-center w-full items-start my-10 px-6">
      <div className="max-w-2xl flex flex-col">
        <Section
          title={"Was gewinne ich?"}
          content={
            <>
              <span className="font-bold">Maoams.</span> Jede{" "}
              <span className="font-bold">1000 Guun-Coins (₲)</span>, die du
              besitzt, sind ein Maoam wert. Keine Sorge, wir runden auf und in
              Sektion 3 erfährst du, wie du sehr viele Guun-Coins machen kannst.
            </>
          }
        />
        <Section
          title={"1 Erstelle dir einen Account"}
          content={
            <>
              Am Besten vergisst du dein Usernamen und dein Passwort nicht, die
              Addresse ist recht egal. Du bist übrigens nicht nur limitiert auf
              einen Account, wenn es also mal sehr schlecht läuft,{" "}
              <span className="font-bold">kannst du auch neu anfangen.</span>{" "}
              Log dich einfach aus und erstelle dir ein neus Konto.
            </>
          }
        />
        <Section
          title={"2 Das Dashboard"}
          content={
            <>
              Im Dashboard kannst du dir die drei unterschiedlichen Stocks
              ansehen, siehst dein Geld und kannst Aktien kaufen. Falls die
              Aktie zu teuer ist, kannst du auch einfach einen Anteil einer
              Aktie kaufen.
              <br />
              <br />
              Dein Ziel ist günstig zu kaufen und teuer zu Verkaufen, um einen
              Profit zu machen. Damit deine Aufträge ausgeführt werden, benötigt
              es immer einen Gegenspieler, der verkauft, wenn du kaufen möchtest
              und andersherum. Deswegen, da dein Gegenspieler auch nach dem
              Besten Deal sucht, kauft man immer leicht teurer als der
              tatsächliche Aktienpreis und verkauft etwas günstiger als der
              tatsächliche Aktienpreis.
              <br />
              <br />
              Einen Auftrag, der so gar nicht ausgeführt wird, kannst du auch
              wieder stornieren und einen anderen Preis probieren.
            </>
          }
        />
        <Section
          title={"3 Schau die News!"}
          content={
            <>
              Immer mal wieder startet unter dem News-Tab ein neues{" "}
              <span className="font-bold">Event</span>, durch die News wird also
              angekündigt, welchem Unternehmen es gerade besonders gut geht, in
              das man investieren sollte, und welchem nicht so sehr.{" "}
              <span className="font-bold">
                Die Hauptzutat zum erfolgreichen Investieren ist, die
                Nachrichten zu verfolgen.
              </span>
            </>
          }
        />
        <Section
          title={"4 Das Leaderboard"}
          content={<>Selbsterklärend. Sei gut, lande oben, farm Aura.</>}
        />
      </div>
    </div>
  );
}
