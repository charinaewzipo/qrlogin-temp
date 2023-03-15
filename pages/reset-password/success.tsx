import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import Head from 'next/head'
import React, { useEffect } from 'react'
import Image from '@sentry/components/image';
import { LOGIN_PATH } from '@ku/constants/routes';
import { useRouter } from 'next/router';
import { get, isEmpty } from 'lodash';
import LogoOnlyLayout from '@ku/layouts/LogoOnlyLayout';
import { LoadingButton } from '@mui/lab';


const ResetPassword = () => {
  const theme = useTheme()
  const router = useRouter()
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0),
  }))


  useEffect(() => {
    console.log("router", router.query)
  }, [])

  return (
    <>
      <Head>
        <title> Success | KU</title>
      </Head>

      <LogoOnlyLayout />

      <ContentStyle >
        <Stack>
          <Stack spacing={2} sx={{ position: 'relative', mt: 12 }} >
            <Typography variant="h5" textAlign="center">Your password has been reset!</Typography>
            <Box
              component="div"
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Image
                alt="Artboard Copy"
                src={'/assets/illustrations/characters/Artboard Copy.png'}
                sx={{ objectFit: "cover", my: 5, width: 327.33 }}
                disabledEffect
              />
            </Box>

            <Stack direction="column" spacing={0.5}>
              <Typography variant="body1" >Thanks for your interest.</Typography>
              <Typography variant="body1" sx={{ color: theme.palette.primary.main }} >{isEmpty(router.query) ? '' : get(router, "query.id", '').toString()}</Typography>
              <Box component="div"
                sx={{
                  display: 'flex',
                }}>
                <Typography variant="body1" sx={{ my: 2 }}>We have sent detail to your inbox to confirm this action.</Typography>
              </Box>
              <Typography variant="body1" >All the best,</Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              mt: 4,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
          </Box>
          <LoadingButton
            fullWidth
            size="medium"
            type="submit"
            variant="outlined"
            sx={{ color: theme.palette.text.primary, border: `1px solid ${theme.palette.divider}`, mt: 3 }}
            onClick={() => router.push(LOGIN_PATH)}
          >
            <Image
              alt="Icon Base"
              src={'/assets/icons/direction/Icon Base.png'}
              sx={{ objectFit: 'cover', height: 20.67, mr: 1 }}
            />
            Back to Login page
          </LoadingButton>


        </Stack>
      </ContentStyle>

    </>
  )
}

export default ResetPassword
