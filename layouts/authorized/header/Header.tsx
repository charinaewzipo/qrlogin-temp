// @mui
import { useTheme } from '@mui/material/styles'
import { Stack, AppBar, Toolbar, IconButton } from '@mui/material'
// utils
import { bgBlur } from '@sentry/utils/cssStyles'
// hooks
import useOffSetTop from '@sentry/hooks/useOffSetTop'
import useResponsive from '@sentry/hooks/useResponsive'
// config
import { HEADER, NAV } from '@sentry/components/layout'
// components
import Logo from '@sentry/components/logo'
import Iconify from '@sentry/components/iconify'
import { useSettingsContext } from '@sentry/components/settings'
//
import AccountPopover from './AccountPopover'
import LanguagePopover from './LanguagePopover'
import NotificationsPopover from './NotificationsPopover'

// ----------------------------------------------------------------------

type Props = {
    onOpenNav?: VoidFunction
}

export default function Header({ onOpenNav }: Props) {
    const theme = useTheme()

    const { themeLayout } = useSettingsContext()

    const isNavHorizontal = themeLayout === 'horizontal'

    const isNavMini = themeLayout === 'mini'

    const isDesktop = useResponsive('up', 'lg')

    const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal

    const renderContent = (
        <>
            {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

            {!isDesktop && (
                <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
                    <Iconify icon="eva:menu-2-fill" />
                </IconButton>
            )}

            <Stack
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={{ xs: 0.5, sm: 1.5 }}
            >
                <LanguagePopover />

                <NotificationsPopover />

                <AccountPopover />
            </Stack>
        </>
    )

    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                    color: theme.palette.background.default,
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
                ...(isDesktop && {
                    width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
                    height: HEADER.H_DASHBOARD_DESKTOP,
                    ...(isOffset && {
                        height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
                    }),
                    ...(isNavHorizontal && {
                        width: 1,
                        bgcolor: 'background.default',
                        height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
                        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }),
                    ...(isNavMini && {
                        width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
                    }),
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    px: { lg: 5 },
                }}
            >
                {renderContent}
            </Toolbar>
        </AppBar>
    )
}
