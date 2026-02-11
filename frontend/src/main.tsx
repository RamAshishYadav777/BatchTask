import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import store from './redux/store'
import './index.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from './App'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Prevent refetch on window focus
            refetchOnReconnect: true, // Refetch when internet reconnects
            retry: 1, // Retry failed requests once
            staleTime: 30 * 1000, // 30 seconds - data considered fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - cache time
            networkMode: 'online', // Only fetch when online
        },
        mutations: {
            retry: 0, // Don't retry mutations
            networkMode: 'online',
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Provider>
    </StrictMode>,
)
