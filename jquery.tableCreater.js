(function($) {
    const createCallPopup = (phoneNumber) => {
      const popup = $(`
        <div class="call-popup">
          <div class="popup-header">
            <span>Call Options</span>
            <div>
              <button class="minimize-btn">_</button>
              <button class="close-btn">×</button>
            </div>
          </div>
          <div class="popup-content">
            <p>Calling: ${phoneNumber}</p>
            <div class="popup-actions">
              <button class="call-btn">Call Now</button>
            </div>
          </div>
        </div>
      `);
      popup.find('.close-btn').click(() => popup.remove());
      popup.find('.minimize-btn').click(() => popup.toggleClass('minimized'));
      popup.find('.call-btn').click(() => {
        alert(`Connecting call to ${phoneNumber}`);
        popup.remove();
      });
      $('body').append(popup);
    };

    const createTcPopup = (rowData) => {
      const nameParts = rowData.name.split(" ");
      const firstName = nameParts[0] || "FirstName";
      const lastName = nameParts[1] || "LastName";
      
      const tableHTML = `
        <table class="tc-table">
          <thead>
            <tr>
              <th>TC Number</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${rowData.tckm}</td>
              <td>${firstName}</td>
              <td>${lastName}</td>
              <td>${rowData.birthPlace}</td>
            </tr>
          </tbody>
        </table>
      `;
      
      const popup = $(`
        <div class="tc-popup">
          <div class="popup-header">
            <span>TC Details</span>
            <div>
              <button class="minimize-btn">_</button>
              <button class="close-btn">×</button>
            </div>
          </div>
          <div class="popup-content">
            ${tableHTML}
            <div class="popup-actions">
              <button class="ok-btn">OK</button>
            </div>
          </div>
        </div>
      `);
      popup.find('.close-btn').click(() => popup.remove());
      popup.find('.minimize-btn').click(() => popup.toggleClass('minimized'));
      popup.find('.ok-btn').click(() => {
        alert('TC details acknowledged');
        popup.remove();
      });
      $('body').append(popup);
    };

    $.fn.tableCreater = function(options) {
      const settings = $.extend({
        data: [],
        columns: [],
        expandable: true
      }, options);

      const createExpandableRow = (rowData, columns) => {
        const row = $('<tr>');
        columns.forEach((col, index) => {
          const cell = $('<td>');
          if(index === 0 && settings.expandable) {
            cell.prepend(`<span class="expand-btn">+</span>`);
            cell.find('.expand-btn').click(function() {
              $(this).text($(this).text() === '+' ? '-' : '+');
              row.next('.nested-row').toggle();
            });
          }
          if(index === 1) {
            cell.css('cursor', 'pointer');
            cell.click(() => createTcPopup(rowData));
          }
          if(index === 2) {
            cell.css('cursor', 'pointer');
            cell.click(() => createCallPopup(rowData[col.dataKey]));
          }
          cell.append(rowData[col.dataKey]);
          row.append(cell);
        });

        if(settings.expandable) {
          const nestedRow = $(`
            <tr class="nested-row" style="display: none;">
              <td colspan="${columns.length}">
                <div class="nested-table">
                  <table class="main-table">
                    ${createTableContent(rowData.details, settings.columns)}
                  </table>
                </div>
              </td>
            </tr>
          `);
          return row.add(nestedRow);
        }
        return row;
      };

      const createTableContent = (data, columns) => {
        let content = '<thead><tr>';
        columns.forEach(col => content += `<th>${col.title}</th>`);
        content += '</tr></thead><tbody>';
        data.forEach(item => {
          content += '<tr>';
          columns.forEach(col => content += `<td>${item[col.dataKey]}</td>`);
          content += '</tr>';
        });
        return content + '</tbody>';
      };

      return this.each(function() {
        const container = $(this);
        const table = $('<table class="main-table">');
        const headerRow = $('<tr>');
        settings.columns.forEach(col => headerRow.append($('<th>').text(col.title)));
        table.append($('<thead>').append(headerRow));
        const body = $('<tbody>');
        settings.data.forEach(item => {
          body.append(createExpandableRow(item, settings.columns));
        });
        table.append(body);
        container.addClass('table-container').html(table);
      });
    };
  })(jQuery);

  const tableData = [
    {
      name: "Gökhan Türkmen",
      tckm: "29292929929286",
      phone: "05322121212",
      birthPlace: "Kayseri",
      details: [
        {
          name: "Detail 1",
          tckm: "11111111111",
          phone: "05551112233",
          birthPlace: "Ankara"
        }
      ]
    },
    {
      name: "Fatma Turunç",
      tckm: "2929295232112",
      phone: "05322634312",
      birthPlace: "İstanbul",
      details: [
        {
          name: "Detail 2",
          tckm: "22222222222",
          phone: "05554445566",
          birthPlace: "İzmir"
        }
      ]
    }
  ];

  $(document).ready(() => {
    $('#main-container').tableCreater({
      data: tableData,
      columns: [
        { title: 'Name', dataKey: 'name' },
        { title: 'TC Number', dataKey: 'tckm' },
        { title: 'Phone Number', dataKey: 'phone' },
        { title: 'Birth Place', dataKey: 'birthPlace' }
      ]
    });
  });