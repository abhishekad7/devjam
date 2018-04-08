import requests
from bs4 import BeautifulSoup

proxy={}



def show_rank_menu():
	menu=["Teams","Batsmen","Bowlers","AllRounders"]
	for i in range(4):
		print "%d %s"%(i+1,menu[i])

def ch_rank():
	while(1==1):
		try:
			return int(raw_input().strip())
		except:
			print "Choose only one option."

def show_ranking(url):
	try:
		r=requests.get(url,proxies=proxy)
	except:
		print "Unable to Connect Server"
		print "Quiting"
		from sys import exit
		exit()

	print "1.Test"
	print "2.ODI"
	print "3.T20"
	while(1==1):
		try:
			ch=int(raw_input().strip())
			ch=ch-1
			break
		except:
			print "Try Again..\n"

	soup=BeautifulSoup(r.content,'lxml')
	rank_name=list(soup.find_all("div",class_='list-group'))
	tbl_res=list(soup.find_all("div",class_='table-responsive'))
	del tbl_res[-1]
	del tbl_res[-1]
	print list(rank_name[ch].children)[0].text,'\n',"---------------------\n"
	for t_data in list(list(tbl_res[ch].children)[0].children):
		s=[]
		for td_data in t_data.children:
			s.append(td_data.text)
		print s[0].ljust(6," ")+s[1].ljust(16," ")+s[2].ljust(14," ")+s[3].ljust(7," ")
