"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react"
import { getTestResults, deleteTestResults } from "./actions"

// Mapeamento de áreas do teste para áreas de carreira com cursos
const areaMapping: Record<string, { name: string; color: string; courses: string[] }> = {
  "logico-matematica": {
    name: "Ciências Exatas e Tecnologia",
    color: "bg-blue-200 text-blue-700",
    courses: [
      "Engenharia (Civil, Mecânica, Elétrica, Computação)",
      "Matemática e Estatística",
      "Física",
      "Ciência da Computação",
      "Análise de Sistemas",
      "Ciência de Dados",
    ],
  },
  linguistica: {
    name: "Comunicação e Letras",
    color: "bg-purple-200 text-purple-700",
    courses: [
      "Jornalismo",
      "Letras (Português, Inglês, Espanhol)",
      "Publicidade e Propaganda",
      "Relações Públicas",
      "Tradução e Interpretação",
      "Editoração",
    ],
  },
  espacial: {
    name: "Artes, Design e Arquitetura",
    color: "bg-pink-200 text-pink-700",
    courses: [
      "Arquitetura e Urbanismo",
      "Design Gráfico",
      "Design de Interiores",
      "Artes Visuais",
      "Moda",
      "Cinema e Audiovisual",
      "Animação 3D",
    ],
  },
  "corporal-cinestesica": {
    name: "Educação Física e Saúde",
    color: "bg-orange-200 text-orange-700",
    courses: [
      "Educação Física",
      "Fisioterapia",
      "Dança",
      "Teatro",
      "Esportes",
      "Terapia Ocupacional",
      "Cirurgia (Medicina)",
    ],
  },
  musical: {
    name: "Música e Artes Cênicas",
    color: "bg-indigo-200 text-indigo-700",
    courses: [
      "Música (Bacharelado e Licenciatura)",
      "Produção Musical",
      "Regência",
      "Musicoterapia",
      "Sonoplastia",
      "Composição",
    ],
  },
  interpessoal: {
    name: "Ciências Humanas e Sociais",
    color: "bg-amber-200 text-amber-700",
    courses: [
      "Psicologia",
      "Pedagogia",
      "Serviço Social",
      "Recursos Humanos",
      "Sociologia",
      "Administração",
      "Direito",
    ],
  },
  intrapessoal: {
    name: "Filosofia e Autoconhecimento",
    color: "bg-teal-200 text-teal-700",
    courses: ["Filosofia", "Psicologia", "Coaching", "Teologia", "Pesquisa Acadêmica", "Escrita Criativa"],
  },
  naturalista: {
    name: "Ciências Biológicas e Meio Ambiente",
    color: "bg-green-200 text-green-700",
    courses: [
      "Biologia",
      "Engenharia Ambiental",
      "Agronomia",
      "Veterinária",
      "Oceanografia",
      "Ecologia",
      "Gestão Ambiental",
    ],
  },
  existencial: {
    name: "Filosofia e Ciências Humanas",
    color: "bg-gray-200 text-gray-700",
    courses: ["Filosofia", "Teologia", "Ciências Sociais", "Antropologia", "História", "Psicologia"],
  },
}

interface TestResult {
  area: string
  areaKey: string
  percentage: number
  color: string
  courses: string[]
}

export function VocationalTest() {
  const router = useRouter()
  const [results, setResults] = useState<TestResult[]>([])
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [hasResults, setHasResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      const response = await getTestResults()

      if (response.success && response.data) {
        const parsedResults = response.data

        const formattedResults: TestResult[] = Object.entries(parsedResults)
          .map(([key, percentage]) => ({
            area: areaMapping[key]?.name || key,
            areaKey: key,
            percentage: percentage as number,
            color: areaMapping[key]?.color || "bg-gray-200 text-gray-700",
            courses: areaMapping[key]?.courses || [],
          }))
          .sort((a, b) => b.percentage - a.percentage)

        setResults(formattedResults)
        setHasResults(true)

        if (formattedResults.length > 0) {
          setSelectedArea(formattedResults[0].areaKey)
        }
      } else {
        setHasResults(false)
      }

      setIsLoading(false)
    }

    fetchResults()
  }, [])

  const handleRepeatTest = async () => {
    setIsDeleting(true)
    await deleteTestResults()
    setIsDeleting(false)
    router.push("/fazer-teste")
  }

  const selectedAreaData = results.find((r) => r.areaKey === selectedArea)

  if (isLoading) {
    return (
      <div className="h-full overflow-hidden">
        <Card className="p-6 h-full overflow-hidden flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FC1F69] mb-4" />
          <p className="text-muted-foreground">Carregando resultados...</p>
        </Card>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div className="h-full overflow-hidden">
        <Card className="p-6 h-full overflow-hidden flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Você ainda não fez o teste</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Descubra qual área combina mais com você fazendo o teste vocacional.
          </p>
          <Button onClick={() => router.push("/fazer-teste")} className="bg-[#FC1F69] hover:bg-[#E01B5E]">
            Fazer Teste
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden">
      <Card className="p-4 h-full overflow-hidden flex flex-col">
        <h2 className="text-base font-semibold mb-3 flex-shrink-0">Seu resultado</h2>

        <div className="grid grid-cols-3 gap-1.5 mb-3 flex-shrink-0">
          {results.slice(0, 9).map((result, idx) => (
            <Card
              key={idx}
              className={`${result.color} p-1.5 text-center space-y-0 cursor-pointer transition-transform hover:scale-105 ${selectedArea === result.areaKey ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
              onClick={() => setSelectedArea(result.areaKey)}
            >
              <div className="text-lg font-bold">{result.percentage}%</div>
              <p className="text-[7px] font-medium leading-tight">{result.area}</p>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 flex-1 min-h-0">
          {/* Seção - Repetir teste */}
          <div className="flex-shrink-0 w-[140px]">
            <h3 className="font-semibold text-sm mb-1">Deseja outros resultados?</h3>
            <p className="text-xs text-muted-foreground mb-2">Faça o teste novamente</p>
            <Button
              onClick={handleRepeatTest}
              disabled={isDeleting}
              className="bg-[#FC1F69] hover:bg-[#E01B5E] text-xs py-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Aguarde...
                </>
              ) : (
                <>
                  Repetir Teste
                  <ArrowRight className="w-3 h-3 ml-2" />
                </>
              )}
            </Button>
          </div>

          <Card className="p-3 flex-1 flex flex-col min-h-0 overflow-hidden">
            <h3 className="font-semibold text-sm mb-2 flex-shrink-0">Opções de curso por área</h3>

            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm hover:bg-accent/50 transition-colors"
              >
                <span className="truncate">
                  {selectedAreaData
                    ? `${selectedAreaData.area} (${selectedAreaData.percentage}%)`
                    : "Selecione uma área"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 opacity-50 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                  <div className="max-h-[150px] overflow-auto p-1">
                    {results.map((result) => (
                      <button
                        key={result.areaKey}
                        type="button"
                        onClick={() => {
                          setSelectedArea(result.areaKey)
                          setDropdownOpen(false)
                        }}
                        className={`flex w-full items-center rounded-sm px-2 py-1.5 text-xs hover:bg-accent transition-colors ${selectedArea === result.areaKey ? "bg-accent" : ""}`}
                      >
                        {result.area} ({result.percentage}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedAreaData && (
              <ul className="mt-2 space-y-0.5 overflow-auto flex-1">
                {selectedAreaData.courses.map((course, idx) => (
                  <li key={idx} className="text-[10px] text-muted-foreground flex items-start gap-1">
                    <span className="text-[#FC1F69]">•</span>
                    {course}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </Card>
    </div>
  )
}
