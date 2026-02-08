/**
 * Legal Notice Component - 法律声明组件
 * 医疗AI平台的法律声明和用户协议
 * 
 * 开发：菊花教授 周宏锋
 */

import React from 'react';
import { AlertTriangle, Shield, FileText, Scale, Heart, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface LegalNoticeProps {
  type?: 'full' | 'summary';
}

export const LegalNotice: React.FC<LegalNoticeProps> = ({ type = 'full' }) => {
  if (type === 'summary') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">重要法律声明</p>
            <p className="leading-relaxed">
              本平台的AI分析结果仅供参考，不能替代专业医生的诊断和治疗建议。
              如有健康问题，请及时就医。使用本平台即表示您同意我们的
              <a href="#" className="underline hover:text-amber-900">用户协议</a>和
              <a href="#" className="underline hover:text-amber-900">隐私政策</a>。
            </p>
          </div>
        </div>
        <p className="text-xs text-amber-600 mt-2 text-right">
          开发：菊花教授 周宏锋
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部声明 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center mb-4">
          <Scale className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-bold">法律声明与用户协议</h2>
        </div>
        <p className="text-white/90 leading-relaxed">
          欢迎使用 PhotoMed 医疗智能底座。在使用本平台之前，请仔细阅读以下法律声明和用户协议。
          使用本平台即表示您已阅读、理解并同意遵守以下条款。
        </p>
        <p className="text-white/80 text-sm mt-4 text-right">
          开发：菊花教授 周宏锋
        </p>
      </div>

      {/* 医疗免责声明 */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center">
            <Stethoscope className="w-6 h-6 text-red-600 mr-2" />
            <CardTitle className="text-red-800">医疗免责声明</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 mb-2">重要提示</p>
              <p className="text-gray-700 leading-relaxed">
                本平台提供的所有AI分析结果、健康建议和风险评估仅供参考，
                <strong className="text-red-600">不能替代专业医生的诊断、治疗建议或医疗决策</strong>。
                平台不保证分析结果的准确性、完整性和及时性。
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 text-gray-700">
            <p className="font-medium">用户须知：</p>
            <ul className="space-y-2 ml-5 list-disc">
              <li>如有任何健康问题或症状，请及时咨询专业医生或前往医疗机构就诊</li>
              <li>本平台不能用于紧急医疗情况的诊断和处理</li>
              <li>对于因使用本平台信息而导致的任何直接或间接损失，平台不承担责任</li>
              <li>用户应自行判断信息的适用性，并承担使用风险</li>
              <li>平台建议用户定期进行专业体检，而非仅依赖本平台分析</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 用户协议 */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <CardTitle>用户协议</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. 服务说明</h4>
              <p className="leading-relaxed">
                PhotoMed 是一个基于AI技术的医疗健康辅助平台，通过手机拍照提供健康分析服务。
                平台包含健康自测场景（皮肤、指甲、口腔等）和专业医疗场景（体检报告分析等）。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. 用户责任</h4>
              <ul className="space-y-1 ml-5 list-disc">
                <li>提供真实、准确的个人信息</li>
                <li>确保上传的图片不侵犯他人隐私和权益</li>
                <li>不得将平台用于非法目的</li>
                <li>妥善保管个人账号信息</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. 知识产权</h4>
              <p className="leading-relaxed">
                本平台的所有技术、算法、界面设计、文档内容等知识产权归开发者所有。
                未经授权，不得复制、修改、传播或用于商业用途。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. 服务变更与终止</h4>
              <p className="leading-relaxed">
                平台保留随时修改、暂停或终止服务的权利，恕不另行通知。
                对于因服务变更或终止造成的损失，平台不承担责任。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">5. 争议解决</h4>
              <p className="leading-relaxed">
                因使用本平台产生的任何争议，双方应友好协商解决；
                协商不成的，提交开发者所在地人民法院诉讼解决。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 隐私政策 */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-green-600 mr-2" />
            <CardTitle>隐私政策</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. 数据收集</h4>
              <p className="leading-relaxed">
                平台可能收集的信息包括：用户上传的图片、设备信息、使用日志等。
                所有数据仅用于提供分析服务，不会用于其他商业目的。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. 数据存储</h4>
              <ul className="space-y-1 ml-5 list-disc">
                <li>用户上传的图片和分析结果存储在用户本地设备</li>
                <li>平台不永久存储用户的健康数据</li>
                <li>用户可随时删除自己的数据</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. 数据安全</h4>
              <p className="leading-relaxed">
                平台采用加密技术保护数据传输安全。但由于网络环境的复杂性，
                无法保证绝对的数据安全，用户需自行承担数据传输风险。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. 第三方共享</h4>
              <p className="leading-relaxed">
                未经用户明确同意，平台不会向第三方共享、出售或出租用户的个人信息。
                仅在法律法规要求或保护平台合法权益时，可能披露相关信息。
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">5. 用户权利</h4>
              <ul className="space-y-1 ml-5 list-disc">
                <li>访问、更正自己的个人信息</li>
                <li>删除自己的数据和账户</li>
                <li>撤回对数据处理的同意</li>
                <li>投诉数据安全问题</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 未成年人保护 */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-purple-600 mr-2" />
            <CardTitle className="text-purple-800">未成年人保护</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed">
            本平台主要面向成年用户。未成年人使用本平台应在监护人陪同下进行，
            且监护人应对未成年人的使用行为负责。平台不建议未成年人独立使用涉及专业医疗判断的功能。
          </p>
        </CardContent>
      </Card>

      {/* 联系方式 */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <p className="text-gray-600 text-center">
            如对以上条款有任何疑问，请联系开发者。
          </p>
          <p className="text-gray-800 font-medium text-center mt-2">
            开发：菊花教授 周宏锋
          </p>
          <p className="text-gray-500 text-sm text-center mt-1">
            版本：v1.0.0 | 更新日期：2024年
          </p>
        </CardContent>
      </Card>

      {/* 版权信息 */}
      <div className="text-center text-gray-500 text-sm py-4">
        <p>© 2024 PhotoMed 医疗智能底座. All Rights Reserved.</p>
        <p className="mt-1">开发：菊花教授 周宏锋</p>
      </div>
    </div>
  );
};

export default LegalNotice;
