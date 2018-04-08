import requests,sys
from bs4 import BeautifulSoup

proxy={}


#GETTING LIVE MATCHES LIST
def find_live_matches(link):
  lis=[]
  print "Connecting..."
  try:
    r=requests.get(link,proxies=proxy)
    cric=BeautifulSoup(r.content,'lxml')
  except:
    print "Can't Connect to internet"
    print "Quiting Program"
    sys.exit()


  for matches in cric.find_all("span"):
		if(matches.get('class')==["matchheader"]):
			lis.append(matches.text)

  return lis


def get_match_link(m_name,b_url):
  print "Connecting...."
  try:
    r=requests.get(b_url,proxies=proxy)
    cric=BeautifulSoup(r.content,'lxml')
  except:
    print "Can't connect to internet"
	
	#GETTING MATCH Link

  for mat in cric.find_all("span"):
		if(mat.get('class')==["matchheader"] and mat.text==m_name):
			match_link=mat.parent.parent.parent.parent.get('href')
			return b_url+match_link


def fetch_score(m_link):
  status=""
  try:
    match_src=requests.get(m_link,proxies=proxy)
    match_scr=BeautifulSoup(match_src.content,'lxml')
  except:
    return "Can't Connect to internet"
  stat=[]
  ctm=0
  for match in match_scr.find_all("span"):
    try:
      if(match.get('class')[0]=="cbz-ui-status" or match.get('class')[0]=='crr'):
        stat.append(match.text)
      try:
        if(match.get('class')[1]=="ui-bat-team-scores" or match.get('class')[1]=="ui-bowl-team-scores"):
          stat.append(match.text)
      except:
        pass
      if(match.get('class')==["bat-bowl-miniscore"] and ctm!=2):
        ct=1
        a=""
        for ty in list(match.parent.parent.parent.parent.children):
          if(ct<3):
            a+=(ty.text+" ")
            ct+=1
        if(a not in stat):
          stat.append(a)
        ctm+=1
    except:
      continue
  for k in stat:
    status+=(k+'\n')
  return status

def active_notify(match_name,bas_url,t_out):
  try:
    mtch_link=get_match_link(match_name,bas_url)
    print "Connected"
  except:
    print "Can't Connect to Internet"
  import time,pynotify
  while(1==1):
    m_stat=fetch_score(mtch_link)
    pynotify.init("ak")
    n=pynotify.Notification(match_name,m_stat)
    n.set_timeout(25)
    n.show()
    time.sleep(t_out)

def show_score(match_name,bas_url):
	mtch_link=get_match_link(match_name,bas_url)
	print fetch_score(mtch_link)

def scorecard(match_name,b_url):
  mtch_link=get_match_link(match_name,b_url)
  try:
    r=requests.get(mtch_link,proxies=proxy)
    soup=BeautifulSoup(r.content,'lxml')
  except:
    print "Can't Connect to internet"
  scorecard_link=""
  for match in soup.find_all("span"):
    if(match.text.strip()=="Scorecard"):
      scorecard_link=b_url+match.parent.get('href')
  scr_teams_lis=match_name.split("vs")
  print "1.%s"%(scr_teams_lis[0].strip())
  print "2.%s"%(scr_teams_lis[-1].strip())
  while(1==1):
    try:
      ch=int(raw_input("Choose Team 1 or 2\n").strip())
      break
    except:
      print "Choose Correctly "
  scorecard_link+=("/"+str(ch))
  try:
    r=requests.get(scorecard_link,proxies=proxy)
    soup=BeautifulSoup(r.content,'lxml')
    for dat in soup.find_all('span'):
      if((dat.get('class')==["bat-bowl-data"]) and list(dat.parent.parent.parent.parent.parent.parent.parent.parent.children)[0].text.strip()!="Bowling"):
        j=""
        j+=((list(dat.parent.parent.parent.parent.children)[0].text)+" ")
        j+=((list(dat.parent.parent.parent.parent.children)[1].text))
        k=j.split(" ")
        runs=k[-1]
        del k[-1]
        k=" ".join(k)
        print k.ljust(20," "),runs
  except:
    print "Scorecard not found"