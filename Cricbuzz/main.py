base_url="http://m.cricbuzz.com"
menu=("Recent_Matches","Schedule","Point_Table","Rankings","Proxy Settings")
menu_links={"Recent_Matches":"http://m.cricbuzz.com","Schedule":"http://m.cricbuzz.com/cricket-schedule","Point_Table":"http://m.cricbuzz.com/cricket-pointstable","Rankings":"http://m.cricbuzz.com/cricket-stats/iccrankings"}

m_list=list()
ch_match=0
ch_service=0

#SHOW MENU
def show_menu():
	for i in range(len(menu)):
		print "%d. %s"%(i+1,menu[i])


def choose_match():
	global m_list
	while(1==1):
		try:
			ch=int(raw_input().strip())
			return [ch,m_list[ch-1]]
		except:
			print "Try Again, Choose only one Match "

show_menu()

while(1==1):
	try:
		ch=int(raw_input().strip())
		break
	except:
		print "Try Again, Choose only one Option: "

#RECENT MATCHES

if(ch==1):
	from live import *
	#GETTING MATCHES
	m_list=find_live_matches(menu_links[menu[0]])
	m_list=list(set(m_list))

	#SHOWING MATCHES

	def match_select():
		global ch_match
		print "%d recent matches found, Choose Yours:"%(len(m_list))
		for i in m_list:
			print "%d. %s"%(m_list.index(i)+1,i)
		ch_match=choose_match()


	def after_match_select():
		global ch_match
		print "You chose %d.%s \n"%(ch_match[0],ch_match[1])
		print "1.Activate Notification"
		print "2.Show Score"
		print "3.Scorecard"
		print "4.Another Match"
		global ch_service
		while(1==1):
			try:
				ch_service=int(raw_input().strip())
				break
			except:
				print "Try Again, Choose only one Option: "


	def recent_match_services():
		global ch_service
		if(ch_service==1):
			while(1==1):
				try:
					t_o=int(raw_input("Time between consecutive Notifications(in seconds>15) ").strip())
					break
				except:
					print "Please enter time correctly."
			active_notify(ch_match[1],base_url,t_o)

		if(ch_service==2):
			show_score(ch_match[1],base_url)

		if(ch_service==3):
			scorecard(ch_match[1],base_url)
		if(ch_service==4):
			match_select()
			after_match_select()
			recent_match_services()

	match_select()
	after_match_select()
	recent_match_services()



#SCHEDULE

if(ch==2):
	pass

if(ch==3):
	pass


if(ch==4):
	from ranking import *
	show_rank_menu()
	ch_rank=ch_rank()
	ch_list=["none","teams","batting","bowling","allrounders"]
	base_rank_url="http://m.cricbuzz.com/cricket-stats/iccrankings/"
	rank_url=base_rank_url+ch_list[ch_rank]
	show_ranking(rank_url)