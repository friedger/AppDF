/**
 * Generating description.xml XML from the AppDF editor HTML5 page
 * Depends on: jquery.js, xmlgenerator.js,
 * 
 * Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Copyright (c) 2012 Vassili Philippov <vassiliphilippov@onepf.org>
 * Copyright (c) 2012 One Platform Foundation <www.onepf.org>
 * Copyright (c) 2012 Yandex <www.yandex.com>
 */

function generateCategorizationXML(xml) {
	xml.addTag("<categorization>", function() {
		xml.addTag("<type>", $("#categorization-type").val());
		xml.addTag("<category>", $("#categorization-category").val());
		xml.addTag("<subcategory>", $("#categorization-subcategory").val());
	});
};

function generateOneLanguageDescription(languageCode, xml) {
	$parent = $("#localization-tab-" + languageCode);

	xml.addTag("<texts>", function() {
		//Title
		xml.addNonEmptyTextTag("<title>", $parent.find("#description-texts-title").val());
		$parent.find("input[id^=description-texts-title-more-]").each(function() {
			xml.addNonEmptyTextTag("<title>", $(this).val());
		});

		//Keywords
		var keywords = [];
		keywords.push($parent.find("#description-texts-keywords").val());
		$parent.find("input[id^=description-texts-keywords-more-]").each(function() {
			keywords.push($(this).val());
		});
		xml.addNonEmptyTextTag("<keywords>", keywords.join(","));

		//Short description
		xml.addNonEmptyTextTag("<short-description>", $parent.find("#description-texts-shortdescription").val());
		$parent.find("input[id^=description-texts-shortdescription-more-]").each(function() {
			xml.addNonEmptyTextTag("<short-description>", $(this).val());
		});

		//Full description
		xml.addNonEmptyTextTag("<full-description>", $parent.find("#description-texts-fulldescription").val());

		//Features
		xml.addTag("<features>", function() {
			$parent.find("input[id^=description-texts-features-]").each(function() {
				xml.addNonEmptyTextTag("<feature>", $(this).val());
			});
		});

		//Recent changes
		var strRecentChanges = $parent.find("#description-texts-recentchanges").val();
		if (strRecentChanges!="") {
			xml.addNonEmptyTextTag("<recent-changes>", strRecentChanges);		
		};

		//Privacy policy and EULA links
		var strPrivacyPolicy = $parent.find("#description-texts-privacypolicy").val();
		var strEULA = $parent.find("#description-texts-eula").val();
		if (strPrivacyPolicy!="") {
			xml.addNonEmptyTextTag("<privacy-policy>", strPrivacyPolicy);		
		};
		if (strEULA!="") {
			xml.addNonEmptyTextTag("<eula>", strEULA);		
		};
	});		
};

function generateDescriptionXML(xml) {
	xml.addTag("<description>", function() {
		generateOneLanguageDescription("default", xml);
	});
};

function generateDescriptionLocalizationsXML(xml) {
	var languages = getDescriptionLanguages();
	for (var i=0; i<languages.length; i++) {
		var languageCode = languages[i];
		if (languageCode!="default") {
			xml.addTag("<description-localization language=\"" + languageCode + "\">", function() {
				generateOneLanguageDescription(languageCode, xml);
			});
		};
	};
};

function generateCustomerSupportXML(xml) {
	xml.addTag("<customer-support>", function() {
		xml.addTag("<phone>", $("#customersupport-phone").val());
		xml.addTag("<email>", $("#customersupport-email").val());
		xml.addTag("<website>", $("#customersupport-website").val());
	});
};

function isCheckboxChecked(id) {
	return document.getElementById(id).checked ? "yes" : "no";
}

function generateConsentXML(xml) {
	xml.addTag("<consent>", function() {
		xml.addTag("<google-android-content-guidelines>", isCheckboxChecked("consent-googleandroidcontentguidelines"));
		xml.addTag("<us-export-laws>", isCheckboxChecked("consent-usexportlaws"));
	});
};

function generateApkFilesXML(xml) {
	xml.addTag("<apk-files>", function() {
		$("section#apk-files").find("input:file").each(function() {
			xml.addTag("<apk-file>", normalizeInputFileName($(this).val()));
		});
	});
};

function generatePriceXML(xml) {
	var free = $("section#price").find("li.active").find("a").attr("href") == "#tab-price-free";
	var freeAttribute = free ? "yes" : "no";
	xml.addTag("<price free=\"" + freeAttribute + "\">", function() {
		if (free) {
			var trialVersion = $("#price-free-trialversion").attr("checked");
			if (trialVersion=="checked") {
				if ($("#price-free-fullversion").val()!="") {
					xml.addTag("<trial-version full-version=\"" + $("#price-free-fullversion").val() + "\">", "");
				} else {
					xml.addTag("<trial-version>", "")
				};
			};
		} else {
			xml.addTag("<base-price>", $("#price-baseprice").val())
			$("section#price").find("input[id^=price-localprice-]").each(function() {
				var countryCode = $(this).closest("div.control-group").find("select").val();
				xml.addTag("<local-price country=\"" + countryCode + "\">", $(this).val());
			});
		};
		// xml.addTag("<google-android-content-guidelines>", isCheckboxChecked("consent-googleandroidcontentguidelines"));
		// xml.addTag("<us-export-laws>", isCheckboxChecked("consent-usexportlaws"));
	});
};

function generateDescriptionFileXML() {
	var xml = new XMLGenerator();
	xml.addLine('<?xml version="1.0" encoding="UTF-8"?>');
	xml.addTag('<application-description-file version="1">', function() {
		xml.addTag('<application package="' + firstApkFileData.package + '">', function() {
			generateCategorizationXML(xml);
			generateDescriptionXML(xml);
			generateDescriptionLocalizationsXML(xml);
			generatePriceXML(xml);
			generateApkFilesXML(xml);
			generateCustomerSupportXML(xml);
			generateConsentXML(xml);
		});
	});
	return xml.getXmlText();
};