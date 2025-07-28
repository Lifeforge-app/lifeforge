let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Desktop/lifeforge
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +25 client/src/apps/Passwords/index.tsx
badd +34 client/src/apps/Passwords/components/PasswordList.tsx
badd +1 client/src/apps/Passwords/components/PasswordEntryItem.tsx
badd +45 client/src/apps/Passwords/components/ContentContainer.tsx
badd +39 client/src/apps/Passwords/modals/ModifyPasswordModal.tsx
argglobal
%argdel
edit client/src/apps/Passwords/modals/ModifyPasswordModal.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 30 + 88) / 176)
exe '2resize ' . ((&lines * 31 + 25) / 50)
exe 'vert 2resize ' . ((&columns * 145 + 88) / 176)
exe '3resize ' . ((&lines * 15 + 25) / 50)
exe 'vert 3resize ' . ((&columns * 145 + 88) / 176)
argglobal
enew
file NvimTree_1
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal nofoldenable
wincmd w
argglobal
balt client/src/apps/Passwords/components/ContentContainer.tsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 43 - ((19 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 43
normal! 06|
wincmd w
argglobal
if bufexists(fnamemodify("term://~/Desktop/lifeforge//64844:/bin/zsh", ":p")) | buffer term://~/Desktop/lifeforge//64844:/bin/zsh | else | edit term://~/Desktop/lifeforge//64844:/bin/zsh | endif
if &buftype ==# 'terminal'
  silent file term://~/Desktop/lifeforge//64844:/bin/zsh
endif
balt client/src/apps/Passwords/modals/ModifyPasswordModal.tsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
let s:l = 1 - ((0 * winheight(0) + 7) / 15)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 041|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 30 + 88) / 176)
exe '2resize ' . ((&lines * 31 + 25) / 50)
exe 'vert 2resize ' . ((&columns * 145 + 88) / 176)
exe '3resize ' . ((&lines * 15 + 25) / 50)
exe 'vert 3resize ' . ((&columns * 145 + 88) / 176)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
