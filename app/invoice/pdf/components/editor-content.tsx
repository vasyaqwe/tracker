import type { EditorDoc } from "@/invoice/pdf/types"
import { View } from "@react-pdf/renderer"
import { formatEditorContent } from "../format"

export function EditorContent({ content }: { content?: EditorDoc }) {
   if (!content) return null

   return <View style={{ marginTop: 10 }}>{formatEditorContent(content)}</View>
}
