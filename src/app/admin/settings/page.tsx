import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Profil Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="admin@nafbirdfarm.com" disabled />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="outline" className="w-fit">Change Password</Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Website Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input id="siteName" defaultValue="NAF Aviary" />
                    </div>
                     <div className="flex justify-end">
                        <Button>Save Changes</Button>
                     </div>
                </CardContent>
            </Card>
        </div>
    )
}
