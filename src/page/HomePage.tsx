import React from "react"
import "animate.css" // ✅ Thêm Animate.css
import {
  FaArrowRight,
  FaWallet,
  FaUsers,
  FaFileAlt,
  FaShieldAlt,
  FaChartBar,
  FaClock,
  FaBolt,
  FaHeart,
  FaLock,
  FaArrowDown,
} from "react-icons/fa"
import Header from "../components/header"
import Footer from "../components/footer"
import BackToTop from "../components/backToTop"

// 🧩 Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500",
  }

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// 🧩 Card component
interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>
)

const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
)

const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 pt-4 ${className}`}>{children}</div>
)

// 🌟 Hero Section
const Hero: React.FC = () => (
  <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 to-cyan-50">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Text bên trái */}
      <div className="space-y-6 animate__animated animate__fadeInLeft">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Sở hữu xe hơi <span className="text-blue-600">thông minh</span>
        </h1>
        <p className="text-lg text-gray-600">
          Chia sẻ chi phí, chia sẻ trách nhiệm. Nền tảng quản lý đồng sở hữu xe hơi toàn diện.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Bắt đầu miễn phí
            <FaArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            Xem demo
          </Button>
        </div>
      </div>

      {/* Ảnh bên phải */}
      <div className="relative h-96 md:h-full animate__animated animate__fadeInRight flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-cyan-100 rounded-2xl blur-3xl"></div>
        <img
          src="https://storage.googleapis.com/f1-cms/2021/06/1b79ceb7-20210607_034302.jpg"
          alt="CarShare"
          className="relative rounded-2xl shadow-lg border border-blue-100 object-cover w-full h-full"
        />
      </div>
    </div>
  </section>
);


// ⚙️ Features Section
interface Feature {
  icon: React.ElementType
  title: string
  description: string
}

const features: Feature[] = [
  { icon: FaWallet, title: "Đồng sở hữu", description: "Chia sẻ chi phí mua xe, bảo dưỡng và nhiên liệu với người khác" },
  { icon: FaUsers, title: "Cộng đồng", description: "Kết nối chủ xe và người đồng sở hữu đáng tin cậy" },
  { icon: FaFileAlt, title: "Hợp đồng điện tử", description: "Mọi giao dịch đều có hợp đồng pháp lý rõ ràng" },
  { icon: FaShieldAlt, title: "Bảo hiểm toàn diện", description: "Bảo vệ bạn và chiếc xe trong mọi tình huống" },
]

const Features: React.FC = () => (
  <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-16">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 animate__animated animate__fadeInDown">
        Tính năng nổi bật
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <Card key={i} className="animate__animated animate__fadeInUp animate__delay-1s">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{f.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </section>
)

// 🧭 How It Works
interface Step {
  icon: React.ElementType
  title: string
  description: string
}

const steps: Step[] = [
  { icon: FaChartBar, title: "Đăng ký", description: "Tạo tài khoản và xác minh danh tính" },
  { icon: FaClock, title: "Chọn xe", description: "Chọn gói đồng sở hữu phù hợp với nhu cầu" },
  { icon: FaShieldAlt, title: "Ký hợp đồng", description: "Thực hiện hợp đồng điện tử và bắt đầu sử dụng" },
]

const HowItWorks: React.FC = () => (
 <section id="how-it-works" className="bg-gray-50 py-20 md:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-16">
    <div className="max-w-7xl mx-auto text-center animate__animated animate__fadeInUp">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Cách hoạt động</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={i} className="animate__animated animate__zoomIn">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{s.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </section>
)

// 💎 Benefits Section
interface Benefit {
  icon: React.ElementType
  title: string
  stat: string
  description: string
}

const benefits: Benefit[] = [
  { icon: FaArrowDown, title: "Tiết kiệm chi phí", stat: "Giảm 40-60%", description: "Chia sẻ chi phí xăng, bảo hiểm và bảo dưỡng" },
  { icon: FaBolt, title: "Linh hoạt", stat: "24/7", description: "Sử dụng xe khi bạn cần, không cần cam kết dài hạn" },
  { icon: FaHeart, title: "Tin cậy", stat: "100%", description: "Xác minh danh tính và bảo hiểm toàn diện" },
  { icon: FaLock, title: "An toàn", stat: "Bảo vệ", description: "Hợp đồng pháp lý và hỗ trợ tranh chấp" },
]

const Benefits: React.FC = () => (
 <section id="benefits" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeInUp scroll-mt-16">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Tại sao chọn CarShare?</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => {
          const Icon = b.icon
          return (
            <Card key={i} className="text-center animate__animated animate__pulse animate__delay-1s">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>{b.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{b.stat}</p>
                <p className="text-gray-600 text-sm">{b.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </section>
)

// 🚀 CTA Section
const CTA: React.FC = () => (
  <section className="py-20 bg-blue-600 text-white text-center animate__animated animate__fadeInUp">
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">Bắt đầu chia sẻ xe hơi ngay hôm nay</h2>
      <p className="text-lg text-blue-100">
        Gia nhập cộng đồng CarShare và tận hưởng quyền sở hữu linh hoạt, tiết kiệm, an toàn.
      </p>
      <Button
        size="lg"
        className="text-blue-600 border border-white hover:bg-blue-50"
      >
        Đăng ký ngay <FaArrowRight className="ml-2" />
      </Button>
    </div>
  </section>
)

// 🏁 HomePage
const HomePage: React.FC = () => {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <CTA />
      <Footer />
      <BackToTop />
    </main>
  )
}

export default HomePage
