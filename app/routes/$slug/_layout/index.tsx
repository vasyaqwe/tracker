import { Main } from "@/routes/$slug/-components/main"
import { Table } from "@/ui/components/table"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import type { Selection } from "react-aria-components"

export const Route = createFileRoute("/$slug/_layout/")({
   component: Component,
   loader: async () => {},
   meta: () => [{ title: "Home" }],
   // pendingComponent: PendingComponent,
})
const books = [
   {
      id: "1",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      publishedYear: 1960,
   },
   {
      id: "2",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      publishedYear: 1949,
   },
   {
      id: "3",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      publishedYear: 1925,
   },
   {
      id: "4",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      publishedYear: 1951,
   },
   {
      id: "5",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      publishedYear: 1813,
   },
   {
      id: "6",
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      publishedYear: 1954,
   },
   {
      id: "7",
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      genre: "Fantasy",
      publishedYear: 1997,
   },
]

function Component() {
   // const { slug } = useParams({ from: "/$slug/_layout" })
   const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

   return (
      <Main>
         <main>
            <div className="rounded-[11px] border border-border">
               <Table
                  aria-label="Books"
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
               >
                  <Table.Header>
                     <Table.Column>#</Table.Column>
                     <Table.Column isRowHeader>Title</Table.Column>
                     <Table.Column>Author</Table.Column>
                     <Table.Column>Genre</Table.Column>
                     <Table.Column>Published</Table.Column>
                  </Table.Header>
                  <Table.Body items={books}>
                     {(item) => (
                        <Table.Row>
                           <Table.Cell>{item.id}</Table.Cell>
                           <Table.Cell>{item.title}</Table.Cell>
                           <Table.Cell>{item.author}</Table.Cell>
                           <Table.Cell>{item.genre}</Table.Cell>
                           <Table.Cell>{item.publishedYear}</Table.Cell>
                        </Table.Row>
                     )}
                  </Table.Body>
               </Table>
            </div>
         </main>
      </Main>
   )
}
