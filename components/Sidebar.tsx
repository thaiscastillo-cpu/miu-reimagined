"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const NAV = [
  { href: "/", icon: "home", label: "Dashboard" },
  { href: "/tareas", icon: "tasks", label: "Mis tareas" },
  { href: "/horario", icon: "calendar", label: "Horario" },
  { href: "/avisos", icon: "bell", label: "Avisos" },
];

type Props = { name: string; initials: string; pendingCount: number; children: React.ReactNode };

export function AppShell({ name, initials, pendingCount, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`} id="sidebar">
        <div className="row brand">
          <span className="brand-mark" aria-hidden="true">M</span>
          <div>
            <b>MiU</b>
            <small>REIMAGINED · DEMO</small>
          </div>
        </div>
        <div>
          <div className="nav-label">Ingeniería Empresarial</div>
          <nav className="nav" aria-label="Navegación principal">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? "active" : ""}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <Icon name={item.icon} />
                {item.label}
                {item.href === "/tareas" && pendingCount > 0 ? (
                  <span className="count" aria-label={`${pendingCount} pendientes`}>{pendingCount}</span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
        <div className="side-bottom">
          <div className="side-note">
            <strong>
              Un lugar para todo
              <br />
              lo que viene.
            </strong>
            <br />
            Segundo semestre · 2026
          </div>
          <div className="side-user row">
            <div className="avatar">{initials}</div>
            <div>
              <b>{name}</b>
              <span>Estudiante</span>
            </div>
            <form action="/auth/signout" method="post" style={{ marginLeft: "auto" }}>
              <button type="submit" aria-label="Cerrar sesión">
                <Icon name="logout" />
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={open}
            aria-controls="sidebar"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" />
          </button>
          <div className="row top-right">
            <Link className="icon-btn notification" href="/avisos" aria-label="Ver avisos">
              <Icon name="bell" />
            </Link>
            <div className="avatar" aria-hidden="true">{initials}</div>
          </div>
        </header>
        <main className="content" id="content">
          {children}
        </main>
      </div>
    </div>
  );
}
