import { formatCurrency } from "@/utils/format"
import { Text, View } from "@react-pdf/renderer"

export function Summary({
   amount,
   totalLabel = "Total",
}: {
   amount: number
   totalLabel?: string
}) {
   return (
      <View
         style={{
            marginTop: 60,
            marginBottom: 40,
            alignItems: "flex-end",
            marginLeft: "auto",
            width: 250,
         }}
      >
         <View
            style={{
               flexDirection: "row",
               marginTop: 5,
               borderBottomWidth: 0.5,
               borderBottomColor: "#000",
               justifyContent: "space-between",
               alignItems: "center",
               paddingBottom: 5,
               width: "100%",
            }}
         >
            <Text style={{ fontSize: 9, marginRight: 10 }}>{totalLabel}</Text>
            <Text style={{ fontSize: 21 }}>{formatCurrency(amount)}</Text>
         </View>
      </View>
   )
}
