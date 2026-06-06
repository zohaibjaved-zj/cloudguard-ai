import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import threading
import webbrowser
import os
import sys
import time

# ── Colors ──
BG     = '#020b18'
CARD   = '#0a2540'
BLUE   = '#0ea5e9'
CYAN   = '#22d3ee'
GREEN  = '#22c55e'
RED    = '#ef4444'
ORANGE = '#f97316'
WHITE  = '#f1f5f9'
GRAY   = '#64748b'
BORDER = '#1e293b'

class CloudGuardLauncher:
    def __init__(self, root):
        self.root = root
        self.root.title('CloudGuard AI')
        self.root.geometry('680x520')
        self.root.configure(bg=BG)
        self.root.resizable(False, False)
        self.running = False
        self.setup_ui()

    def setup_ui(self):
        # ── Header ──
        header = tk.Frame(self.root, bg='#041528', pady=20)
        header.pack(fill='x')

        tk.Label(header, text='🛡 CloudGuard AI',
                 font=('Helvetica', 26, 'bold'),
                 fg=CYAN, bg='#041528').pack()

        tk.Label(header, text='AI-Powered Cloud Misconfiguration Detection',
                 font=('Helvetica', 10),
                 fg=GRAY, bg='#041528').pack(pady=(2,0))

        tk.Frame(self.root, bg=BORDER, height=1).pack(fill='x')

        # ── Status Card ──
        status_frame = tk.Frame(self.root, bg=CARD, pady=15)
        status_frame.pack(fill='x', padx=20, pady=15)

        tk.Label(status_frame, text='STATUS',
                 font=('Helvetica', 8, 'bold'),
                 fg=GRAY, bg=CARD).pack()

        self.status_dot = tk.Label(status_frame, text='●',
                                    font=('Helvetica', 24),
                                    fg=GRAY, bg=CARD)
        self.status_dot.pack(pady=(5,0))

        self.status_label = tk.Label(status_frame, text='Stopped',
                                      font=('Helvetica', 14, 'bold'),
                                      fg=WHITE, bg=CARD)
        self.status_label.pack()

        # ── Service Status Grid ──
        grid_frame = tk.Frame(self.root, bg=BG)
        grid_frame.pack(padx=20, pady=5, fill='x')

        services = [
            ('Frontend',   'React 18',   ':5173'),
            ('Backend',    'Node.js 20', ':5000'),
            ('ML Engine',  'Python 3.11',':8000'),
            ('Database',   'PostgreSQL', ':5432'),
        ]

        self.svc_dots = {}
        for i, (name, tech, port) in enumerate(services):
            col_frame = tk.Frame(grid_frame, bg=CARD, relief='flat', bd=0)
            col_frame.grid(row=0, column=i, padx=5, pady=5, sticky='ew')
            grid_frame.columnconfigure(i, weight=1)

            dot = tk.Label(col_frame, text='●', font=('Helvetica', 12),
                           fg=GRAY, bg=CARD)
            dot.pack(pady=(8,2))
            self.svc_dots[name] = dot

            tk.Label(col_frame, text=name,
                     font=('Helvetica', 9, 'bold'),
                     fg=WHITE, bg=CARD).pack()

            tk.Label(col_frame, text=tech,
                     font=('Helvetica', 7),
                     fg=GRAY, bg=CARD).pack()

            tk.Label(col_frame, text=port,
                     font=('Courier', 8),
                     fg=CYAN, bg=CARD).pack(pady=(0,8))

        # ── Buttons ──
        btn_frame = tk.Frame(self.root, bg=BG)
        btn_frame.pack(pady=15)

        self.start_btn = tk.Button(
            btn_frame, text='▶  Start CloudGuard AI',
            font=('Helvetica', 12, 'bold'),
            bg='#2563eb', fg=WHITE,
            activebackground='#1d4ed8', activeforeground=WHITE,
            relief='flat', padx=30, pady=12, cursor='hand2',
            command=self.start_platform
        )
        self.start_btn.grid(row=0, column=0, padx=8)

        self.stop_btn = tk.Button(
            btn_frame, text='■  Stop',
            font=('Helvetica', 12, 'bold'),
            bg=CARD, fg=GRAY,
            activebackground='#1e293b', activeforeground=WHITE,
            relief='flat', padx=30, pady=12, cursor='hand2',
            command=self.stop_platform,
            state='disabled'
        )
        self.stop_btn.grid(row=0, column=1, padx=8)

        self.open_btn = tk.Button(
            btn_frame, text='🌐  Open Browser',
            font=('Helvetica', 12, 'bold'),
            bg=CARD, fg=GRAY,
            activebackground='#1e293b', activeforeground=WHITE,
            relief='flat', padx=30, pady=12, cursor='hand2',
            command=self.open_browser,
            state='disabled'
        )
        self.open_btn.grid(row=0, column=2, padx=8)

        # ── Log Console ──
        tk.Label(self.root, text='CONSOLE OUTPUT',
                 font=('Helvetica', 7, 'bold'),
                 fg=GRAY, bg=BG).pack(anchor='w', padx=20)

        log_frame = tk.Frame(self.root, bg='#010810')
        log_frame.pack(fill='both', expand=True, padx=20, pady=(4,15))

        self.log = tk.Text(
            log_frame,
            bg='#010810', fg='#22c55e',
            font=('Courier', 8),
            relief='flat', padx=10, pady=8,
            wrap='word', state='disabled'
        )
        scroll = ttk.Scrollbar(log_frame, command=self.log.yview)
        self.log.configure(yscrollcommand=scroll.set)
        scroll.pack(side='right', fill='y')
        self.log.pack(fill='both', expand=True)

        # ── Footer ──
        tk.Label(self.root,
                 text='CloudGuard AI  |  Hackathon 2026  |  docker-compose up --build',
                 font=('Helvetica', 7),
                 fg=GRAY, bg=BG).pack(pady=(0,8))

        self.log_msg('CloudGuard AI Launcher ready.')
        self.log_msg('Click "Start CloudGuard AI" to launch the platform.')

    def log_msg(self, msg, color='#22c55e'):
        self.log.configure(state='normal')
        self.log.insert('end', f'> {msg}\n')
        self.log.configure(state='disabled')
        self.log.see('end')

    def set_status(self, text, color):
        self.status_label.configure(text=text)
        self.status_dot.configure(fg=color)

    def set_service_status(self, name, online):
        if name in self.svc_dots:
            self.svc_dots[name].configure(fg=GREEN if online else GRAY)

    def start_platform(self):
        self.start_btn.configure(state='disabled')
        self.set_status('Starting...', ORANGE)
        self.log_msg('Starting CloudGuard AI platform...')
        threading.Thread(target=self._run_start, daemon=True).start()

    def _run_start(self):
        try:
            # Get directory of the exe/script
            if getattr(sys, 'frozen', False):
                app_dir = os.path.dirname(sys.executable)
            else:
                app_dir = os.path.dirname(os.path.abspath(__file__))

            self.log_msg('Stopping any existing containers...')
            subprocess.run(
                ['docker-compose', 'down', '--remove-orphans'],
                cwd=app_dir, capture_output=True
            )

            self.log_msg('Building and starting containers...')
            self.log_msg('This may take 2-5 minutes on first run...')

            proc = subprocess.Popen(
                ['docker-compose', 'up', '--build', '-d'],
                cwd=app_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )

            for line in proc.stdout:
                line = line.strip()
                if line:
                    self.root.after(0, self.log_msg, line)

            proc.wait()

            if proc.returncode == 0:
                self.root.after(0, self._on_started)
            else:
                self.root.after(0, self._on_error, 'docker-compose failed')

        except FileNotFoundError:
            self.root.after(0, self._on_error,
                           'Docker not found. Please install Docker Desktop.')
        except Exception as e:
            self.root.after(0, self._on_error, str(e))

    def _on_started(self):
        self.running = True
        self.set_status('Running', GREEN)
        for name in self.svc_dots:
            self.set_service_status(name, True)
        self.stop_btn.configure(state='normal', bg='#7f1d1d', fg=WHITE)
        self.open_btn.configure(state='normal', bg='#065f46', fg=WHITE)
        self.log_msg('All containers started successfully!')
        self.log_msg('Frontend running at http://localhost:5173')
        self.log_msg('Backend API running at http://localhost:5000')
        self.open_browser()

    def _on_error(self, msg):
        self.set_status('Error', RED)
        self.log_msg(f'ERROR: {msg}')
        self.start_btn.configure(state='normal')
        messagebox.showerror('CloudGuard AI Error', msg)

    def stop_platform(self):
        self.stop_btn.configure(state='disabled')
        self.set_status('Stopping...', ORANGE)
        self.log_msg('Stopping CloudGuard AI...')
        threading.Thread(target=self._run_stop, daemon=True).start()

    def _run_stop(self):
        if getattr(sys, 'frozen', False):
            app_dir = os.path.dirname(sys.executable)
        else:
            app_dir = os.path.dirname(os.path.abspath(__file__))

        subprocess.run(['docker-compose', 'down'], cwd=app_dir)
        self.root.after(0, self._on_stopped)

    def _on_stopped(self):
        self.running = False
        self.set_status('Stopped', GRAY)
        for name in self.svc_dots:
            self.set_service_status(name, False)
        self.start_btn.configure(state='normal')
        self.stop_btn.configure(state='disabled', bg=CARD, fg=GRAY)
        self.open_btn.configure(state='disabled', bg=CARD, fg=GRAY)
        self.log_msg('CloudGuard AI stopped.')

    def open_browser(self):
        webbrowser.open('http://localhost:5173')

if __name__ == '__main__':
    root = tk.Tk()
    app = CloudGuardLauncher(root)
    root.mainloop()