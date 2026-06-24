import 'server-only'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportPDF } from './ReportPDF'
import type { ReportData } from '@/lib/types'
import type { ReportInsights } from '@/lib/ai/analyze'

/** Renderiza o relatório em um Buffer de PDF (uso server-side). */
export async function renderReportPdf(data: ReportData, insights?: ReportInsights): Promise<Buffer> {
  return renderToBuffer(ReportPDF({ data, insights }))
}
