import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">TERMOS DE USO - PARALELLO</h1>
            <p className="text-center text-gray-500 mb-8">Última atualização: 01/12/2025</p>

            <div className="prose prose-gray max-w-none space-y-8">
              {/* 1. ACEITAÇÃO DOS TERMOS */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">1. ACEITAÇÃO DOS TERMOS</h2>
                <p className="text-gray-700 mb-2">Bem-vindo ao Paralello - Seu caminho até a universidade!</p>
                <p className="text-gray-700">
                  Ao acessar e utilizar nossa plataforma, você concorda com estes Termos de Uso. Se você não concordar
                  com qualquer parte destes termos, não utilize nossos serviços.
                </p>
              </section>

              {/* 2. SOBRE O PARALELLO */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">2. SOBRE O PARALELLO</h2>
                <p className="text-gray-700 mb-3">
                  O Paralello é uma plataforma digital gratuita de auxílio focado para vestibulandos brasileiros que
                  oferece:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Centralização de informações sobre vestibulares brasileiros</li>
                  <li>Sistema integrado de organização de estudos</li>
                  <li>Teste vocacional</li>
                  <li>Agenda e calendário de estudos</li>
                  <li>Cronogramas personalizados</li>
                  <li>Método Pomodoro com gerenciamento de tarefas</li>
                  <li>Compartilhamento de resumos entre usuários</li>
                  <li>Alertas e notificações de prazos</li>
                </ul>
              </section>

              {/* 3. CADASTRO E CONTA DE USUÁRIO */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">3. CADASTRO E CONTA DE USUÁRIO</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Requisitos para Cadastro</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Você deve fornecer informações verdadeiras, precisas e atualizadas</li>
                  <li>É necessário ter pelo menos 13 anos para criar uma conta</li>
                  <li>Menores de 18 anos devem ter autorização dos responsáveis legais</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Responsabilidades do Usuário</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                  <li>Você é responsável por todas as atividades realizadas em sua conta</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Suspensão e Cancelamento</h3>
                <p className="text-gray-700">
                  Reservamo-nos o direito de suspender ou cancelar contas que violem estes termos, sem aviso prévio.
                </p>
              </section>

              {/* 4. USO ACEITÁVEL DA PLATAFORMA */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">4. USO ACEITÁVEL DA PLATAFORMA</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Você PODE:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Utilizar todas as funcionalidades oferecidas pela plataforma</li>
                  <li>Compartilhar resumos e materiais de estudo próprios</li>
                  <li>Personalizar seus cronogramas e agendas</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Você NÃO PODE:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Compartilhar conteúdo protegido por direitos autorais sem autorização</li>
                  <li>Publicar material ofensivo, discriminatório, ilegal ou inadequado</li>
                  <li>Utilizar a plataforma para spam, phishing ou outras atividades maliciosas</li>
                  <li>Tentar acessar áreas restritas ou contas de outros usuários</li>
                  <li>Usar bots, scripts ou ferramentas automatizadas não autorizadas</li>
                  <li>Revender ou comercializar o acesso à plataforma</li>
                </ul>
              </section>

              {/* 5. CONTEÚDO DO USUÁRIO */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">5. CONTEÚDO DO USUÁRIO</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Propriedade do Conteúdo</h3>
                <p className="text-gray-700 mb-4">
                  Você mantém todos os direitos sobre o conteúdo que cria e compartilha (resumos, anotações, etc.).
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Licença de Uso</h3>
                <p className="text-gray-700 mb-4">
                  Ao compartilhar conteúdo no Paralello, você concede à plataforma e aos demais usuários uma licença não
                  exclusiva, gratuita e mundial para usar, exibir e distribuir esse conteúdo dentro da plataforma.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.3 Responsabilidade pelo Conteúdo</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Você é o único responsável pelo conteúdo que publica</li>
                  <li>Não nos responsabilizamos por conteúdo gerado por usuários</li>
                  <li>Nos reservamos o direito de remover conteúdo inadequado</li>
                </ul>
              </section>

              {/* 6. PROPRIEDADE INTELECTUAL */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">6. PROPRIEDADE INTELECTUAL</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Direitos do Paralello</h3>
                <p className="text-gray-700 mb-4">
                  Todo o design, código, funcionalidades, logos, textos e elementos da plataforma são propriedade
                  exclusiva do Paralello e estão protegidos por leis de direitos autorais.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Uso Permitido</h3>
                <p className="text-gray-700">
                  Você pode utilizar a plataforma apenas para fins educacionais pessoais, não podendo copiar, reproduzir
                  ou distribuir nosso conteúdo.
                </p>
              </section>

              {/* 7. INFORMAÇÕES SOBRE VESTIBULARES */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">7. INFORMAÇÕES SOBRE VESTIBULARES</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 Precisão das Informações</h3>
                <p className="text-gray-700 mb-2">
                  Nos esforçamos para manter informações atualizadas sobre vestibulares, mas:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Não garantimos a precisão absoluta de todas as informações</li>
                  <li>Recomendamos sempre conferir dados diretamente nos sites oficiais das universidades</li>
                  <li>
                    Não nos responsabilizamos por perdas de prazos ou decisões baseadas exclusivamente em nossas
                    informações
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 Fontes de Dados</h3>
                <p className="text-gray-700">
                  As informações são coletadas de fontes públicas como sites de universidades, INEP e editais oficiais.
                </p>
              </section>

              {/* 8. GRATUIDADE E LIMITAÇÕES */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">8. GRATUIDADE E LIMITAÇÕES</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">8.1 Serviço Gratuito</h3>
                <p className="text-gray-700 mb-4">
                  O Paralello é uma plataforma gratuita voltada à democratização do acesso à educação.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">8.2 Limitações do Serviço</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Não garantimos disponibilidade ininterrupta da plataforma</li>
                  <li>Podemos realizar manutenções que temporariamente limitem o acesso</li>
                  <li>Funcionalidades podem ser adicionadas, modificadas ou removidas</li>
                </ul>
              </section>

              {/* 9. PRIVACIDADE E PROTEÇÃO DE DADOS */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">9. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
                <p className="text-gray-700">
                  A coleta, uso e proteção de seus dados pessoais são regidos por nossa Política de Privacidade, em
                  conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
                </p>
              </section>

              {/* 10. LIMITAÇÃO DE RESPONSABILIDADE */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">10. LIMITAÇÃO DE RESPONSABILIDADE</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">10.1 Isenções</h3>
                <p className="text-gray-700 mb-2">
                  O Paralello é fornecido "como está" e "conforme disponível". Não garantimos:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Que a plataforma estará livre de erros ou interrupções</li>
                  <li>Que os resultados obtidos serão precisos ou confiáveis</li>
                  <li>Aprovação em vestibulares pelo uso da plataforma</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">10.2 Exclusão de Danos</h3>
                <p className="text-gray-700 mb-2">Não nos responsabilizamos por:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Danos diretos ou indiretos decorrentes do uso da plataforma</li>
                  <li>Perda de dados, oportunidades ou prejuízos acadêmicos</li>
                  <li>Problemas técnicos, vírus ou falhas de sistema</li>
                  <li>Conteúdo gerado por terceiros</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">10.3 Uso por Sua Conta e Risco</h3>
                <p className="text-gray-700">Você reconhece que utiliza a plataforma por sua própria conta e risco.</p>
              </section>

              {/* 11. LINKS EXTERNOS */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">11. LINKS EXTERNOS</h2>
                <p className="text-gray-700">
                  Nossa plataforma pode conter links para sites de universidades e outras fontes externas. Não nos
                  responsabilizamos pelo conteúdo ou práticas de sites de terceiros.
                </p>
              </section>

              {/* 12. MODIFICAÇÕES DOS TERMOS */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">12. MODIFICAÇÕES DOS TERMOS</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">12.1 Direito de Alteração</h3>
                <p className="text-gray-700 mb-4">
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">12.2 Notificação</h3>
                <p className="text-gray-700 mb-2">Alterações significativas serão comunicadas através de:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Notificação na plataforma</li>
                  <li>E-mail cadastrado</li>
                  <li>Aviso na página inicial</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">12.3 Continuidade do Uso</h3>
                <p className="text-gray-700">
                  O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
                </p>
              </section>

              {/* 13. ENCERRAMENTO */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">13. ENCERRAMENTO</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">13.1 Por Parte do Usuário</h3>
                <p className="text-gray-700 mb-4">
                  Você pode encerrar sua conta a qualquer momento através das configurações da plataforma ou entrando em
                  contato conosco.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">13.2 Por Parte do Paralello</h3>
                <p className="text-gray-700">
                  Podemos encerrar ou suspender seu acesso imediatamente, sem aviso prévio, em caso de violação destes
                  termos.
                </p>
              </section>

              {/* 14. DISPOSIÇÕES GERAIS */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">14. DISPOSIÇÕES GERAIS</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">14.1 Acordo Integral</h3>
                <p className="text-gray-700 mb-4">
                  Estes Termos constituem o acordo integral entre você e o Paralello.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">14.2 Independência das Cláusulas</h3>
                <p className="text-gray-700 mb-4">
                  Se alguma cláusula for considerada inválida, as demais permanecerão em vigor.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">14.3 Não Renúncia</h3>
                <p className="text-gray-700">
                  A falha em exercer qualquer direito não constitui renúncia a esse direito.
                </p>
              </section>

              {/* 15. LEI APLICÁVEL */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">15. LEI APLICÁVEL</h2>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">15.1 Legislação</h3>
                <p className="text-gray-700">Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>
              </section>

              {/* 16. CONTATO */}
              <section>
                <h2 className="text-xl font-bold text-[#38B6FF] mb-3">16. CONTATO</h2>
                <p className="text-gray-700 mb-2">
                  Para dúvidas, sugestões ou suporte relacionado a estes Termos de Uso:
                </p>
                <p className="text-gray-700">
                  E-mail:{" "}
                  <a href="mailto:paralello.tcc@gmail.com" className="text-[#FC1F69] hover:underline">
                    paralello.tcc@gmail.com
                  </a>
                </p>
                <p className="text-gray-700 mb-4">
                  Site:{" "}
                  <a href="https://paralello.vercel.app" className="text-[#FC1F69] hover:underline">
                    paralello.vercel.app
                  </a>
                </p>
              </section>

              {/* EQUIPE */}
              <section className="border-t pt-8 mt-8">
                <h2 className="text-xl font-bold text-center text-[#38B6FF] mb-4">EQUIPE PARALELLO</h2>
                <p className="text-center text-gray-700 mb-4">
                  Giovanna Bermim | Júlia Sampaio | Pedro Menardi | Sophia Rodrigues
                </p>
                <p className="text-center text-gray-600 italic">
                  "Educação não transforma o mundo. Educação muda as pessoas. Pessoas transformam o mundo." - Paulo
                  Freire
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
