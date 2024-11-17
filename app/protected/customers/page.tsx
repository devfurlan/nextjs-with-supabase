import prisma from "@/lib/prisma";
import { Customer } from "@/types/customer";

async function fetchCustomers(): Promise<Customer[]> {
  const customers = await prisma.customers.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      full_name: true,
      email_address: true,
      phone_number: true,
      created_at: true,
    },
  });

  return customers.map((customer) => ({
    ...customer,
    created_at: customer.created_at.toISOString(),
  }));
}

export const metadata = {
  title: "Lista de Clientes",
  description: "Visualize todos os clientes registrados.",
};

export default async function CustomersPage() {
  const customers = await fetchCustomers();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nome</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Telefone</th>
            <th className="border border-gray-300 px-4 py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="border border-gray-300 px-4 py-2">
                {customer.id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.full_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.email_address || "Não informado"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.phone_number || "Não informado"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(customer.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
