import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LeadsPage() {
    const supabase = await createClient()
    const { data: leads, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        return <div className="p-8 text-red-500">Error loading leads: {error.message}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Interested Prospects</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Date</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="max-w-[300px]">Message</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads?.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        }) : '-'}
                                    </TableCell>
                                    <TableCell className="font-medium text-emerald-900">{lead.name}</TableCell>
                                    <TableCell>
                                        <a href={`https://wa.me/${lead.phone.replace(/^0/, '62')}`} target="_blank" className="hover:underline text-blue-600 flex items-center gap-1">
                                            {lead.phone}
                                        </a>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate text-gray-600" title={lead.message}>
                                        {lead.message || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                                        `}>
                                            {lead.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {leads?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No leads found yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
