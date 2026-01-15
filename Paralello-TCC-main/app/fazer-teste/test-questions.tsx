"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { saveTestResults, type TestResults } from "@/app/agenda/teste-vocacional/actions"

// Todas as 36 perguntas organizadas por área
const questions = [
  // Seção 1: Lógico-Matemática (1-4)
  { id: 1, text: "Adoro resolver problemas complexos e quebra-cabeças.", area: "logico-matematica" },
  { id: 2, text: "Calculo mentalmente com facilidade e precisão.", area: "logico-matematica" },
  { id: 3, text: "Padrões numéricos e sequências lógicas me fascinam.", area: "logico-matematica" },
  { id: 4, text: "Prefiro trabalhar com dados concretos e estatísticas.", area: "logico-matematica" },

  // Seção 2: Linguística (5-8)
  { id: 5, text: "Tenho facilidade para escrever textos e me expressar por escrito.", area: "linguistica" },
  { id: 6, text: "Adoro ler e aprender novas palavras.", area: "linguistica" },
  { id: 7, text: "Conversar, debater e persuadir são atividades que me dão prazer.", area: "linguistica" },
  { id: 8, text: "Aprender novos idiomas é algo natural para mim.", area: "linguistica" },

  // Seção 3: Espacial (9-12)
  { id: 9, text: "Visualizo objetos e cenários em 3D com facilidade.", area: "espacial" },
  { id: 10, text: "Sou bom em ler mapas e me localizar em lugares desconhecidos.", area: "espacial" },
  { id: 11, text: "Desenhar, pintar ou criar representações visuais me atrai.", area: "espacial" },
  { id: 12, text: "Sonho acordado frequentemente com imagens vívidas.", area: "espacial" },

  // Seção 4: Corporal-Cinestésica (13-16)
  { id: 13, text: "Uso gestos e expressões corporais para me comunicar.", area: "corporal-cinestesica" },
  { id: 14, text: "Aprender fazendo (mão na massa) é meu método preferido.", area: "corporal-cinestesica" },
  { id: 15, text: "Tenho boa coordenação motora e controle corporal.", area: "corporal-cinestesica" },
  { id: 16, text: "Preciso me mover e tocar as coisas para compreendê-las.", area: "corporal-cinestesica" },

  // Seção 5: Musical (17-20)
  { id: 17, text: "Percebo facilmente ritmos, batidas e padrões em músicas.", area: "musical" },
  { id: 18, text: "Cantar, tocar instrumentos ou compor me dá prazer.", area: "musical" },
  { id: 19, text: "Identifico quando uma nota está desafinada.", area: "musical" },
  { id: 20, text: "Trabalho ou estudo melhor com música de fundo.", area: "musical" },

  // Seção 6: Interpessoal (21-24)
  { id: 21, text: "Percebo facilmente as emoções e intenções das pessoas.", area: "interpessoal" },
  { id: 22, text: "Atuo como mediador em conflitos naturalmente.", area: "interpessoal" },
  { id: 23, text: "Gosto de trabalhar em grupo e colaborar.", area: "interpessoal" },
  { id: 24, text: "As pessoas costumam me procurar para conselhos.", area: "interpessoal" },

  // Seção 7: Intrapessoal (25-28)
  { id: 25, text: "Passo tempo refletindo sobre meus pensamentos e emoções.", area: "intrapessoal" },
  { id: 26, text: "Tenho autoconhecimento sobre minhas forças e limitações.", area: "intrapessoal" },
  { id: 27, text: "Prefiro trabalhar sozinho em projetos importantes.", area: "intrapessoal" },
  { id: 28, text: "Mantenho um diário ou faço reflexões escritas regularmente.", area: "intrapessoal" },

  // Seção 8: Naturalista (29-32)
  { id: 29, text: "Identifico facilmente espécies de plantas e animais.", area: "naturalista" },
  { id: 30, text: "Gosto de atividades ao ar livre e em contato com a natureza.", area: "naturalista" },
  { id: 31, text: "Percebo rapidamente mudanças no ambiente natural.", area: "naturalista" },
  { id: 32, text: "Preocupo-me com questões ambientais e sustentabilidade.", area: "naturalista" },

  // Seção 9: Existencial (33-36)
  { id: 33, text: "Pergunto-me frequentemente sobre o sentido da vida.", area: "existencial" },
  { id: 34, text: "Debates sobre filosofia e existência humana me interessam.", area: "existencial" },
  { id: 35, text: "Reflito sobre meu papel no universo.", area: "existencial" },
  { id: 36, text: "Questões espirituais são importantes para mim.", area: "existencial" },
]

// Escala de respostas: 1-5
const responseOptions = [
  { value: 5, label: "Concordo totalmente", size: "w-14 h-14 md:w-16 md:h-16", color: "border-green-500" },
  { value: 4, label: "Concordo", size: "w-11 h-11 md:w-12 md:h-12", color: "border-green-500" },
  { value: 3, label: "Neutro", size: "w-8 h-8 md:w-9 md:h-9", color: "border-gray-400" },
  { value: 2, label: "Discordo", size: "w-11 h-11 md:w-12 md:h-12", color: "border-red-500" },
  { value: 1, label: "Discordo totalmente", size: "w-14 h-14 md:w-16 md:h-16", color: "border-red-500" },
]

export function TestQuestions() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSaving, setIsSaving] = useState(false)

  const questionsPerPage = 3
  const totalPages = Math.ceil(questions.length / questionsPerPage)
  const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage)

  const progress = ((currentPage + 1) / totalPages) * 100

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const canProceed = currentQuestions.every((q) => answers[q.id] !== undefined)

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    } else {
      calculateAndSaveResults()
    }
  }

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    } else {
      router.push("/teste-vocacional")
    }
  }

  const calculateAndSaveResults = async () => {
    setIsSaving(true)

    const areaScores: Record<string, number[]> = {
      "logico-matematica": [],
      linguistica: [],
      espacial: [],
      "corporal-cinestesica": [],
      musical: [],
      interpessoal: [],
      intrapessoal: [],
      naturalista: [],
      existencial: [],
    }

    questions.forEach((q) => {
      const answer = answers[q.id] || 0
      areaScores[q.area].push(answer)
    })

    const results: TestResults = {
      "logico-matematica": 0,
      linguistica: 0,
      espacial: 0,
      "corporal-cinestesica": 0,
      musical: 0,
      interpessoal: 0,
      intrapessoal: 0,
      naturalista: 0,
      existencial: 0,
    }

    Object.entries(areaScores).forEach(([area, scores]) => {
      const total = scores.reduce((sum, score) => sum + score, 0)
      const maxPossible = scores.length * 5
      results[area as keyof TestResults] = Math.round((total / maxPossible) * 100)
    })

    const saveResult = await saveTestResults(results)

    if (saveResult.success) {
      router.push("/agenda/teste-vocacional?completed=true")
    } else {
      console.error("Failed to save results:", saveResult.error)
      localStorage.setItem("vocational_test_results", JSON.stringify(results))
      router.push("/agenda/teste-vocacional?completed=true")
    }

    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-[#E91E63] relative">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={handleBack}
          disabled={isSaving}
          className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white rounded-full px-6 py-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="space-y-12">
            {currentQuestions.map((question, idx) => (
              <div key={question.id} className="space-y-6">
                <h2 className="text-center text-gray-600 text-lg font-medium">{question.text}</h2>

                <div className="flex justify-center items-center gap-6 md:gap-10">
                  {responseOptions.map((option) => {
                    const isSelected = answers[question.id] === option.value

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(question.id, option.value)}
                        disabled={isSaving}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div
                          className={`${option.size} rounded-full border-[3px] ${option.color} ${
                            isSelected
                              ? option.value >= 4
                                ? "bg-green-500"
                                : option.value === 3
                                  ? "bg-gray-400"
                                  : "bg-red-500"
                              : "bg-white"
                          } transition-all duration-200 hover:scale-110 cursor-pointer`}
                        />
                        <span className="text-[10px] md:text-xs text-gray-500 text-center max-w-[80px] leading-tight">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button
              onClick={handleNext}
              disabled={!canProceed || isSaving}
              className="bg-[#FFA726] hover:bg-[#FF9800] text-white rounded-full px-12 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : currentPage < totalPages - 1 ? (
                <>
                  Próximo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Ver Resultado
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#E91E63] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-[#E91E63] text-sm mt-2 font-medium">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
