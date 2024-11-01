export type LineItem = {
   name: string
   quantity: number
   price: number
   invoiceNumber?: string
   issueDate?: string
   dueDate?: string
}

export type InlineContent = {
   type: string
   text?: string
   marks?: Mark[]
}

export type Mark = {
   type: string
   attrs?: {
      href?: string
   }
}

export type EditorNode = {
   type: string
   content?: InlineContent[]
}

export type EditorDoc = {
   type: "doc"
   content: EditorNode[]
}
