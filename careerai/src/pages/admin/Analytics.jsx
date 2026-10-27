import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Tabs from '../../components/ui/Tabs'
import { DemoBadge } from '../../components/ui/DemoBadge'
import AnalyticsTab from './analytics/AnalyticsTab'
import SettingsTab from './analytics/SettingsTab'

const tabs = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
]

export default function Analytics() {
  const [tab, setTab] = useState('analytics')
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform analytics & settings"
        description="See how the platform is growing and adjust basic settings."
        badge={<DemoBadge>Sample data</DemoBadge>}
      />
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Analytics sections" />
      {tab === 'analytics' ? <AnalyticsTab /> : <SettingsTab />}
    </div>
  )
}
