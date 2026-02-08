import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            PhotoMed 医疗影像管理平台
          </h1>
          <p className="text-gray-600 text-lg">
            专业的医疗影像存储、管理和分析解决方案
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              欢迎使用 PhotoMed
            </h2>
            <p className="text-gray-600 mb-6">
              这是一个现代化的医疗影像管理平台，提供安全、高效的影像存储和管理服务。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">安全</div>
                <div className="text-gray-600">企业级数据保护</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">快速</div>
                <div className="text-gray-600">高效影像处理</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">智能</div>
                <div className="text-gray-600">AI 辅助诊断</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              快速开始
            </h2>
            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                上传影像
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                查看影像库
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                分析报告
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-600">
          <p>© 2024 PhotoMed. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
