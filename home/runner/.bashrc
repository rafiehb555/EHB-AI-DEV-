
# .bashrc

# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# Basic history configuration
HISTSIZE=1000
HISTFILESIZE=2000
HISTCONTROL=ignoreboth

# Basic prompt
PS1='\w\$ '

# Default aliases
alias ls='ls --color=auto'
alias ll='ls -la'

# Source global definitions
if [ -f /etc/bashrc ]; then
  . /etc/bashrc
fi
