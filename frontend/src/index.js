import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const app = document.getElementById('app')
const root = createRoot(app)
root.render((<BrowserRouter><App /></BrowserRouter>))
