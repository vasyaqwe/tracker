import { formatDateIntl } from "@/utils/format"
import { Text, View } from "@react-pdf/renderer"

export function Meta({
   invoiceNumber,
   issueDate,
   dueDate,
   invoiceNumberLabel = "Invoice number",
   issueDateLabel = "Issue date",
   dueDateLabel = "Due date",
}: {
   invoiceNumber: string
   issueDate: number
   dueDate: number
   invoiceNumberLabel?: string
   issueDateLabel?: string
   dueDateLabel?: string
   dateFormat?: string
}) {
   return (
      <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 40 }}>
         <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 9, fontWeight: 500, marginRight: 5 }}>
               {invoiceNumberLabel}:
            </Text>
            <Text style={{ fontSize: 9 }}>{invoiceNumber}</Text>
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "center",
               alignItems: "center",
            }}
         >
            <Text
               style={{
                  fontSize: 9,
                  fontWeight: 500,
                  marginRight: 5,
               }}
            >
               {issueDateLabel}:
            </Text>
            <Text style={{ fontSize: 9 }}>
               {formatDateIntl(new Date(issueDate).getTime(), {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
               })}
            </Text>
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-end",
               alignItems: "center",
            }}
         >
            <Text style={{ fontSize: 9, fontWeight: 500, marginRight: 5 }}>
               {dueDateLabel}:
            </Text>
            <Text style={{ fontSize: 9 }}>
               {formatDateIntl(new Date(dueDate).getTime(), {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
               })}
            </Text>
         </View>
      </View>
   )
}
