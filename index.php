<?php 
$page_title = "ChessGraphs.com - Lookup, graph and compare chess ratings - FIDE, USCF, or URS - for any player";
include("includes/header.php"); 
?>
<main>
	<div id="input">
		<header id="mini-header">
			<h1><a href="http://www.chessgraphs.com">ChessGraphs.com</a></h1>
			<p class="tagline">Chess rating graphs for any player.</p>
			<p class="tagline">FIDE and USCF.</p>
		</header>
		<?php include("includes/top_players_form.php"); ?>
		<section id="world-champions">
			<div class="section-title-container">
				<h1 class="section-title">World Champions</h1>
				<h1 class="section-title section-title-short">World Champs</h1>
			</div>
			<div class="section-content">
				<div class="buttons-container">
					<label><input type="button" class="checkbox-clear-all-button" onclick="clearCheckboxes('wChamp')" value="Clear All" /></label>						
				</div>
				<form id="w-champ-form" class="checkbox-table-form" method="post" action="dynamic/multiple_players_history.php">	
					<table id="w-champ-table" class="checkbox-table">
						<?php
							$w_champs = array(
								array(
									"Name"=>"Spassky, Boris V",
									"ReignStart" => 1969,
									"ReignEnd" => 1972
								),
								array(
									"Name"=>"Fischer, Robert J",
									"ReignStart" => 1972,
									"ReignEnd" => 1975
								),
								array(
									"Name"=>"Karpov, Anatoly",
									"ReignStart" => 1975,
									"ReignEnd" => 1985
								),
								array(
									"Name"=>"Kasparov, Garry",
									"ReignStart" => 1985,
									"ReignEnd" => 2000
								),
								array(
									"Name"=>"Kramnik, Vladimir",
									"ReignStart" => 2000,
									"ReignEnd" => 2007
								),
								array(
									"Name"=>"Anand, Viswanathan",
									"ReignStart" => 2007,
									"ReignEnd" => 2013
								),
								array(
									"Name"=>"Carlsen, Magnus",
									"ReignStart" => 2013,
									"ReignEnd" => date("Y")
								),
							); 
							$numberOfWorldChamps = count($w_champs) - 1;
							for ( $i = $numberOfWorldChamps; $i >= 0; $i-- ) { ?>
								<tr id=<?= "\"w-champ-row-" . $i . "\"" ?> class="w-champ-row">
									<td class="w-champ-cbox-td"> <input
												id=<?="\"w-champ-cbox-" . $i . "\""?>
												class="w-champ-cbox"
												name=<?= "\"name[" . $i . "]\"" ?>
												value=<?= "\"" . $w_champs[$i]["Name"] . "\"" ?>
												type="checkbox"
											/>
									</td>
									<td class="w-champ-name">
										<label for=<?= "\"w-champ-cbox-" . $i . "\""?> class="checkbox-label">
											<?= $w_champs[$i]["Name"]; ?>
										</label>
									</td>
									<td class="w-champ-reign">
										<label for=<?= "\"w-champ-cbox-" . $i . "\""?> class="checkbox-label">
											<?= $w_champs[$i]["ReignStart"] . "-" . $w_champs[$i]["ReignEnd"]; ?>
										</label>
									</td>
								</tr>
						<?php } ?>
					</table>
				</form>
			</div>
		</section>
		
		<section id="text-input">
			<div class="section-title-container">
				<h1 class="section-title">All Rated Players</h1>
				<h1 class="section-title section-title-short">All Players</h1>
			</div>
			<div class="section-content">
				<div id="user-message"></div>
				<form id="choose-number-of-players-form" method="post" action="">
					<div id="choose-number-of-players">
						<label for="number-of-players">How many players?</label>
						<div id="input-number-of-players-container">
							<input type="number" name="number-of-players" id="input-number-of-players" size="2" 
								maxlength="2" min="1" max="10" required />
							<input type="submit" name="number-of-players" id="submit-number-of-players" value="Go" />
						</div>
					</div>
				</form>
				<form id="input-form" method="get" action="">	
					<div id="enter-player-names">
					</div>
				</form>
			</div>
		</section>

		<section id="about">
			<div class="section-title-container">
				<h1 class="section-title">About</h1>
				<h1 class="section-title section-title-short">About</h1>
			</div>
			<div class="section-content">
				<p><a href="http://www.chessgraphs.com">ChessGraphs.com</a> is the first website that lets you lookup, graph, and compare the rating history of any FIDE- or USCF-rated chess players. The data goes all the way back to when international chess ratings began.</p>
				<p>It's developed by me, <a href="http://www.johnmcneil.me">John McNeil</a>. I'm an avid chess player and web developer. This website is my salute to chess friends world-wide.</p>
				<p>If you find it useful, please share this website with other chess players. If you maintain a website yourself and would be willing to post a link to <a href="http://www.chessgraphs.com">chessgraphs.com</a>, that would be greatly appreciated!</p>
				<p>FIDE ratings since 2001 were obtained from the <a href="http://ratings.fide.com/">FIDE website</a>.
				For prior years, data originating from print sources were obtained from <a href="http://www.olimpbase.org/index.html?http%3A%2F%2Fwww.olimpbase.org%2FElo%2Fsummary.html">OlimpBase</a>: see there for notes on spelling discrepancies and other vagaries in the data.
				USCF ratings were obtained from the <a href="https://new.uschess.org/players/search/">USCF website</a>.</p>
				<p>Comments? Contact <a href="mailto:admin@chessgraphs.com">here</a>. Suggestions are most welcome. New features are on the way, so check back soon.</p>
				<p>Recommended chess websites:</p>
				<ul>
					<li><a href="https://fpawn.blogspot.com/">Fpawn Chess Blog - Michael Aigner</a></li>
					<li><a href="http://www.thechessmind.net">The Chess Mind - FM Dennis Monokroussos</a></li>
					<li><a href="https://dragonbishop.blogspot.com/">Dragon Bishop - Ashik Uzzaman</a></li>
					<li><a href="http://www.alexcolovic.com/">GM Alex Colovic</a></li>
				</ul>
			</div>
		</section>
		<section id="donate">
			<div class="section-title-container">
				<h1 class="section-title">Donate</h1>
				<h1 class="section-title section-title-short">Donate</h1>
			</div>
			<div class="section-content">
				<p>Please support ChessGraphs.com!</p>
				<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="CUBW5V66S7R34">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
				</form>
				<p>This website offers rating history graphs for any players, FIDE and USCF rated, in a user-friendly, convenient format with no registration or log-in required. If you find this useful, please donate to keep it going strong.</p>
				<p>Your donation goes towards website costs like hosting, domain name renewal, and development of new features. Thank you for your support!</p>
			</div>
		</section>
		<footer id="mini-footer">
			<p class="footer-link"><a href="http://www.chessgraphs.com">ChessGraphs.com</a></p>
			<p class="footer-copyright"><small>&#169; 2016<?php 
					if ( date("Y") == 2016 ) { echo("."); }
						else { echo("-" . date("Y") . "."); } 
				?></small> 
			<small class="all-rights-reserved">All rights reserved.</small></p>
		</footer>
	</div>
	<div id="result">
		<!--
		<div id="tip-container">
			<p class="tip-ask">If you find this website useful, please donate to keep it going!</p>
		</div>
	-->
	</div>
</main>

<?php include("includes/footer.php"); ?>
<?php include("includes/form_process.php"); ?>