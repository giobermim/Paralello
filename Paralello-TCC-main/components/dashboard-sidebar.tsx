"use client"

import type React from "react"

import Link from "next/link"
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  ClipboardList,
  Share2,
  Bell,
  HelpCircle,
  ChevronRight,
  User,
  Menu,
  X,
  LogOut,
  Edit,
  Camera,
  Mail,
  Globe,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { signout } from "@/app/auth/actions"
import { getProfile, saveProfile } from "@/app/agenda/perfil/actions"
import { getTodayNotifications } from "@/app/actions/eventos"

interface DashboardSidebarProps {
  activePage?: string
}

export function DashboardSidebar({ activePage }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userPopupOpen, setUserPopupOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userName, setUserName] = useState("Usuário Paralello")
  const [tempUserName, setTempUserName] = useState("")
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const notificationsBtnRef = useRef<HTMLButtonElement>(null)
  const [eventNotifications, setEventNotifications] = useState<any[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getProfile()
        if (result.success && result.data) {
          setUserName(result.data.perfil_nome || "Usuário Paralello")
          setProfileImage(result.data.perfil_foto || null)
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setUserPopupOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    if (userPopupOpen || notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userPopupOpen, notificationsOpen])

  useEffect(() => {
    async function loadNotifications() {
      if (!notificationsOpen) return

      setLoadingNotifications(true)
      try {
        const result = await getTodayNotifications()
        if (result.data) {
          setEventNotifications(result.data)
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error)
      } finally {
        setLoadingNotifications(false)
      }
    }

    if (notificationsOpen) {
      loadNotifications()
    }
  }, [notificationsOpen])

  const handleSignOut = async () => {
    await signout()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const openEditProfile = () => {
    setTempUserName(userName)
    setTempProfileImage(profileImage)
    setUserPopupOpen(false)
    setEditProfileOpen(true)
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const newName = tempUserName || "Usuário Paralello"
      const result = await saveProfile(newName, tempProfileImage)

      if (result.success) {
        setUserName(newName)
        setProfileImage(tempProfileImage)
        setEditProfileOpen(false)
      } else {
        alert("Erro ao salvar perfil: " + result.error)
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      alert("Erro ao salvar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEditProfile = () => {
    setTempUserName(userName)
    setTempProfileImage(profileImage)
    setEditProfileOpen(false)
  }

  const mainMenuItems = [
    { icon: BookOpen, label: "Notas", href: "/agenda/notas" },
    { icon: Calendar, label: "Calendário", href: "/agenda/calendario" },
    { icon: Clock, label: "Método Pomodoro", href: "/agenda/pomodoro" },
    { icon: FileText, label: "Cronograma de Estudos", href: "/agenda/cronograma" },
    { icon: ClipboardList, label: "Teste Vocacional", href: "/agenda/teste-vocacional" },
    { icon: Share2, label: "Resumos Compartilhados", href: "/agenda/resumos" },
  ]

  return (
    <>
      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-blue flex items-center justify-center overflow-hidden border-4 border-[#e7e7e7]">
                {tempProfileImage ? (
                  <img
                    src={tempProfileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#FC1F69] flex items-center justify-center text-white hover:bg-[#FC1F69]/90 transition-colors shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Nome de Usuário
              </Label>
              <Input
                id="username"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full"
              />
            </div>

            <div className="flex gap-3 w-full pt-4">
              <Button
                variant="outline"
                onClick={cancelEditProfile}
                className="flex-1 bg-transparent"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="flex-1 bg-[#FC1F69] hover:bg-[#FC1F69]/90 text-white"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog - Complete PDF content */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Seção de Ajuda</DialogTitle>
            <div className="flex justify-center mt-2">
              <div className="flex h-1 w-32 rounded-full overflow-hidden">
                <div className="flex-1 bg-[#01B0FF]"></div>
                <div className="flex-1 bg-[#ff0068]"></div>
                <div className="flex-1 bg-[#fbca3f]"></div>
                <div className="flex-1 bg-[#caddff]"></div>
              </div>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-2 space-y-6 py-4">
            {/* 1. Notas */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">1. Notas</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>Para criar suas anotações basta clicar no botão "Criar nova nota"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>
                    Em suas anotações é obrigatório adicionar um Título e uma breve Descrição do que vai ser escrito.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FC1F69] mt-1">●</span>
                  <span>
                    É possível publicar as suas anotações para outro usuário poder ter acesso, para isso deixe ativada a
                    opção "Publicar".
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5D90A] mt-1">●</span>
                  <span>Para ter acesso rápido a notas específicas é possível favoritá-las.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>Para editar ou excluir uma anotação clique no botão "Editar nota".</span>
                </li>
              </ul>
            </section>

            {/* 2. Calendário */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">2. Calendário</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>
                    Para adicionar um evento ao seu calendário clique em "Criar evento" ou clique diretamente no dia
                    desejado.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>É obrigatório a adição de um Título ao seu evento.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FC1F69] mt-1">●</span>
                  <span>Você pode adicionar detalhes na seção de Descrição.</span>
                </li>
              </ul>

              <h4 className="text-md font-semibold text-foreground mb-2 ml-2">Sistema de Tags</h4>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#F5D90A] mt-1">●</span>
                  <span>
                    Você pode colocar nossas tags pré definidas em seus eventos (Inscrição, Simulados, Aula de Revisão,
                    Palestra, Day OFF, Redação)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>
                    Caso tenha um evento recorrente que não está entre nossas tags, é possível que você crie suas
                    próprias tags personalizadas para usar em outros dias.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>
                    Para isso basta clicar em "Criar tag personalizada", adicionar um nome e escolher uma cor.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FC1F69] mt-1">●</span>
                  <span>Após isso ela estará disponível em "Suas tags".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5D90A] mt-1">●</span>
                  <span>Caso deseje editar ou excluir sua Tag, basta clicar na mesma.</span>
                </li>
              </ul>
            </section>

            {/* 3. Método Pomodoro */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">3. Método Pomodoro</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>
                    Os intervalos do método contam com 3 versões (o tradicional - 25 minutos, pequena pausa - 5 minutos,
                    longa pausa - 15 minutos)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>
                    Você pode simplesmente iniciar o cronômetro desejado ou criar tarefas específicas com quantos ciclos
                    você desejar.
                  </span>
                </li>
              </ul>
            </section>

            {/* 4. Cronograma de Estudos */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">4. Cronograma de Estudos</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#FC1F69] mt-1">●</span>
                  <span>
                    Nossa plataforma disponibiliza cronogramas específicos para cada área do conhecimento, e um
                    equilibrado.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5D90A] mt-1">●</span>
                  <span>Caso deseje fazer seu próprio cronograma, clique no botão "Criar"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>
                    Assim você poderá escolher qual disciplina será estudada em cada horário de cada dia da semana, após
                    a personalização basta salvar para seu cronograma ficar disponível.
                  </span>
                </li>
              </ul>
            </section>

            {/* 5. Teste Vocacional */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">5. Teste Vocacional</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>
                    Para realizar seu teste é preciso clicar no botão "Fazer teste" e responder a todas as perguntas.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FC1F69] mt-1">●</span>
                  <span>
                    Após ter respondido o teste, os resultados aparecerão em forma de porcentagem em 9 diferentes
                    categorias, você poderá ver as opções de curso em cada categoria.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5D90A] mt-1">●</span>
                  <span>Caso deseje fazer novamente, basta clicar em "Refazer teste".</span>
                </li>
              </ul>
            </section>

            {/* 6. Resumos Compartilhados */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">6. Resumos Compartilhados</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>Nessa seção você terá acesso aos conteúdos publicados por outros usuários.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>Você pode pesquisar as anotações por Disciplina e Título.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FC1F69] mt-1">●</span>
                  <span>Caso deseje ter acesso rápido a anotações específicas basta adicionar aos favoritos.</span>
                </li>
              </ul>
            </section>

            {/* 7. Notificações */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">7. Notificações</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#F5D90A] mt-1">●</span>
                  <span>
                    Caso você tenha ativado as notificações nos Eventos do Calendário, ela ficará disponível o dia
                    inteiro na data do evento.
                  </span>
                </li>
              </ul>
            </section>

            {/* 8. Minha Conta */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">8. Minha Conta</h3>
              <ul className="text-sm text-foreground/80 space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#01B0FF] mt-1">●</span>
                  <span>Se deseja sair da sua conta atual, clique em "Log Out"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7B2FF2] mt-1">●</span>
                  <span>
                    Para editar sua conta, clique no botão de "Editar perfil" e será possível alterar sua foto de perfil
                    e seu nome de usuário.
                  </span>
                </li>
              </ul>
            </section>

            {/* Contact Section */}
            <section className="bg-accent/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-primary mb-3">Entre em Contato</h3>
              <p className="text-sm text-foreground/80 mb-4">Para dúvidas, sugestões ou suporte:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-[#FC1F69]" />
                  <a href="mailto:paralello.tcc@gmail.com" className="text-primary hover:underline">
                    paralello.tcc@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-[#01B0FF]" />
                  <a
                    href="https://paralello.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    paralello.vercel.app
                  </a>
                </div>
              </div>
            </section>

            {/* Team */}
            <section className="text-center pt-4 border-t">
              <h4 className="text-sm font-semibold text-primary mb-2">EQUIPE PARALELLO</h4>
              <p className="text-xs text-foreground/60">
                Giovanna Bermim | Júlia Sampaio | Pedro Menardi | Sophia Rodrigues
              </p>
            </section>

            {/* Quote */}
            <section className="bg-gradient-to-r from-primary/10 to-blue/10 rounded-lg p-4 border-l-4 border-[#FC1F69]">
              <p className="text-sm italic text-foreground/80 text-center">
                "Educação não transforma o mundo. Educação muda as pessoas. Pessoas transformam o mundo."
              </p>
              <p className="text-xs text-foreground/60 text-center mt-2">- Paulo Freire</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background border-2 border-[#e7e7e7] shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileMenuOpen && null}

      <aside
        className={`
        fixed lg:sticky top-0 left-0 
        h-screen lg:h-[calc(100vh-2rem)]
        w-64 bg-background
        border-r-2 lg:border-2 border-[#e7e7e7] shadow-xl 
        flex flex-col z-40
        transition-transform duration-300 ease-in-out overflow-hidden
        lg:rounded-3xl lg:ml-4 lg:my-4
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-3 flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <Link
            href="/"
            className="mb-3 flex items-center justify-center group flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/logo-paralello.png"
              alt="Paralello Logo"
              width={120}
              height={32}
              className="w-auto transition-opacity group-hover:opacity-80 h-[106px]"
              priority
            />
          </Link>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 min-h-0">
            {mainMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.label
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-pink-100 text-primary"
                      : "text-foreground/70 hover:bg-accent/30 hover:text-foreground"
                  }`}
                  onMouseEnter={() => setActiveItem(item.label)}
                  onMouseLeave={() => setActiveItem(null)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110 flex-shrink-0" />
                  <span className="flex-1 truncate text-[11px]">{item.label}</span>
                  {activeItem === item.label && !isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  )}
                </Link>
              )
            })}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            <div className="relative" ref={notificationsRef}>
              <button
                ref={notificationsBtnRef}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground/70 transition-all hover:bg-accent/30 hover:text-foreground group w-full"
              >
                <Bell className="h-4 w-4 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span className="flex-1 truncate text-[11px] text-left">Notificações</span>
                {eventNotifications.filter((n) => !n.read).length > 0 && (
                  <span className="h-5 w-5 rounded-full bg-[#FC1F69] text-white text-[10px] flex items-center justify-center">
                    {eventNotifications.filter((n) => !n.read).length}
                  </span>
                )}
                <ChevronRight
                  className={`h-3.5 w-3.5 text-primary flex-shrink-0 transition-transform ${notificationsOpen ? "rotate-90" : ""}`}
                />
              </button>
            </div>

            {/* Help */}
            <button
              onClick={() => setHelpDialogOpen(true)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground/70 transition-all hover:bg-accent/30 hover:text-foreground group w-full"
            >
              <HelpCircle className="h-4 w-4 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="flex-1 truncate text-[11px] text-left">Ajuda</span>
            </button>
          </nav>

          {/* User section at bottom with popup */}
          <div className="relative mt-auto pt-3 border-t border-border flex-shrink-0" ref={popupRef}>
            {/* User popup menu */}
            {userPopupOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border-2 border-[#e7e7e7] rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={openEditProfile}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-foreground/80 hover:bg-accent/30 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar Perfil</span>
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setUserPopupOpen(!userPopupOpen)}
              className="flex items-center gap-2.5 p-2 hover:bg-accent/30 rounded-lg transition-colors w-full group"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue flex items-center justify-center overflow-hidden border-2 border-[#e7e7e7] flex-shrink-0">
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-medium text-foreground truncate">{isLoading ? "Carregando..." : userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">Vestibulando</p>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${userPopupOpen ? "rotate-90" : ""}`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Notificações</h2>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {loadingNotifications ? (
                <div className="text-center py-8 text-muted-foreground">Carregando notificações...</div>
              ) : eventNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação para hoje</p>
                </div>
              ) : (
                eventNotifications.map((evento) => {
                  const firstTag = evento.tags && evento.tags.length > 0 ? evento.tags[0] : null
                  return (
                    <div key={evento.evento_id} className="p-4 rounded-lg border hover:bg-accent/5 transition-colors">
                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: firstTag ? `${firstTag.tag_cor}20` : "#E5E7EB" }}
                        >
                          <Calendar className="h-5 w-5" style={{ color: firstTag?.tag_cor || "#6B7280" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{evento.evento_titulo}</h3>
                          {evento.evento_descricao && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{evento.evento_descricao}</p>
                          )}
                          {firstTag && (
                            <span
                              className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${firstTag.tag_cor}30`,
                                color: firstTag.tag_cor,
                              }}
                            >
                              {firstTag.tag_nome}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 border-t">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">paralello.tcc@gmail.com</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
