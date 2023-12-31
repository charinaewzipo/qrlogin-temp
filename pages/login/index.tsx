// next
import { Stack, Typography } from '@mui/material'
import Head from 'next/head'
import LoginForm from './LoginForm'
import LoginLayout from '@ku/layouts/login';

// ----------------------------------------------------------------------
export default function LoginPage() {
    return (
        <>
            <Head>
                <title> Login | KU </title>
            </Head>

            <LoginLayout>
            <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
                <Typography variant="h4">Sign in to Scientific Equipment Booking</Typography>
                <Stack direction="row" spacing={0.5}>
                    <Typography variant="body2">Enter your details below</Typography>
                </Stack>
            </Stack>
            <LoginForm />
            </LoginLayout>
        </>
    )
}
